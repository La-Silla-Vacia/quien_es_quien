import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import TableView from './Views/TableView';
import PersonView from './Views/PersonView';
import CompareView from './Views/CompareView';

import Breadcrumbs from './Components/Breadcrumbs';

import s from './base.css';
import t from './_typography.css';
import strings from './strings.json';
let self;
class Base extends Component {

  constructor() {
    super();
    this.state = {
      people: [],
      connections: [],
      width: 400,
      peopleLookup: {},
      currentPerson: false
    };
    self = this;
  }

  componentWillMount() {
    this.setData();
  }

  setData() {
    this.fetchData('data/data.json');
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        return response.json();
      }).then((json) => {
      this.formatData(json);
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  formatData(data) {
    const rawPeople = data.nodes;
    const rawConnections = data.edges;

    const people = this.formatPerson(rawPeople);
    const connections = this.formatConnections(rawConnections);

    const peopleLookup = {};
    for (let i = 0, len = people.length; i < len; i++) {
      peopleLookup[people[i].id] = people[i];
    }

    const connectionsLookup = {};
    for (let i = 0, len = connections.length; i < len; i++) {
      const source = connections[i].source;
      const target = connections[i].target;
      if (!connectionsLookup[source]) {
        connectionsLookup[source] = [];
      }
      if (!connectionsLookup[target]) {
        connectionsLookup[target] = [];
      }
      connectionsLookup[source].push(connections[i]);
      connectionsLookup[target].push(connections[i]);
    }

    this.setState({ people, peopleLookup, connections, connectionsLookup });
  }

  formatPerson(rawPeople) {
    const people = [];
    rawPeople.map((rawPerson) => {
      const person = {
        id: rawPerson.id,
        title: rawPerson.label,
        occupation: (rawPerson.Ocupación) ? rawPerson.Ocupación : 'Sin definir',
        imgurl: rawPerson.imgurl,
        bio: (rawPerson.perfilito) ? rawPerson.perfilito : ['Sin definir'],
        slug: rawPerson.slug,
        numberOfConnections: rawPerson.nconnections,
        numberOfPersonalConnections: rawPerson.nRelPersonal,
        numberOfWorkConnections: rawPerson.nRelLaboral,
        numberOfRivalryConnections: rawPerson.nRelRivalidad,
        numberOfAllianceConnections: rawPerson.nRelAlianza,
        connections: rawPerson.hilos,
        lastUpdate: '20170510'
      };

      people.push(person);
    });
    return people;
  }

  formatConnections(rawConnections) {
    const connections = [];
    rawConnections.map((rawConnection) => {
      const { category, color, id, size, source, subcategory, target } = rawConnection;
      const newColor = (color) ? color.replace('0.45', 1).replace('0.3', 1) : color;
      const connection = { category, color: newColor, id, size, source, subcategory, target };
      connections.push(connection);
    });
    return connections;
  }

  breadCrumbs(people, params) {
    return (
      <Breadcrumbs peopleLookup={people} params={params} />
    )
  }

  personView(props, params) {
    const { peopleLookup, connectionsLookup, breadcrumbs } = props;
    const ids = params.match.params.id.split(',').filter(String);
    const id = ids[ids.length - 1];
    const person = peopleLookup[id];
    const connections = (connectionsLookup[id]) ? connectionsLookup[id] : [];
    const types = [];
    connections.map((rawConnection) => {
      const { category, target, source, color } = rawConnection;
      const connection = (peopleLookup[target].id === id) ? peopleLookup[source] : peopleLookup[target];
      let inArray;
      types.map((type) => {
        if (type.name === category) {
          inArray = true;
          if (type.connections.indexOf(connection) === -1)
            type.connections.push(connection);
        }
      });
      if (!inArray) types.push({ name: category, color, connections: [connection] });
    });

    return (
      <PersonView person={person} breadcrumbs={breadcrumbs} connections={types} />
    )
  }

  compareView(props, params) {
    const { peopleLookup } = props;
    const ids = params.match.params.id.split(',').filter(String);
    const persons = [];
    for (let id of ids) {
      const person = peopleLookup[id];
      persons.push(person);
    }
    const connections = this.findMutualConnections(ids, props);

    return (
      <CompareView persons={persons} connections={connections} />
    )
  }

  findMutualConnections(ids, newProps) {
    const props = (newProps) ? newProps : this.props;
    const { peopleLookup, connectionsLookup } = props;
    const personsConnections = [];

    const allConnIds = [];
    for (let id of ids) {
      const connections = (connectionsLookup[id]) ? connectionsLookup[id] : [];
      const pConnections = [];
      for (let rawConnection of connections) {
        const { target, source } = rawConnection;
        const connection = (peopleLookup[target].id === id) ? peopleLookup[source] : peopleLookup[target];

        if (allConnIds.indexOf(connection.id) === -1) {
          allConnIds.push(connection.id);
        }
        pConnections.push(connection);
      }
      personsConnections.push(pConnections);
    }

    const toBeRemoved = [];
    let removed = 0, count = 0;
    for (let i = 0; i < personsConnections.length; i++) {
      const personConnections = personsConnections[i];
      removed = 0;
      count = 0;
      const personLoopConnections = personConnections.map((item) => {
        return item.id
      });

      for (let j = 0; j < allConnIds.length; j++) {
        const connection = allConnIds[j];
        count++;
        const inConnections = (personLoopConnections.indexOf(connection) !== -1);
        if (!inConnections) {
          toBeRemoved.push(connection);
        }
      }
    }

    for (let id of toBeRemoved) {
      for (let i = allConnIds.length; i--;) {
        if (allConnIds[i] === id) allConnIds.splice(i, 1);
      }
    }

    return allConnIds.map((connection) => {
      return peopleLookup[connection];
    });
  }

  tableView(people) {
    return (
      <TableView people={people} />
    )
  }

  render() {
    const { people, peopleLookup } = this.state;
    const { title } = strings;

    let content = (people.length) ?
      (
        <div className={s.wrap}>
          <HashRouter {...this.state}>
            <div>
              <Route path="/person/:id" component={this.breadCrumbs.bind(true, peopleLookup)} />
              <Route exact path="/" component={this.tableView.bind(false, people)} />
              <Route exact path="/person/:id" component={this.personView.bind(true, this.state)} />
              <Route exact path="/compare/:id" component={this.compareView.bind(this, this.state)} />
            </div>
          </HashRouter>
        </div>
      ) : (
        <div className={s.wrap}>
          <em>El "quién es quién" está siendo cargado</em>
        </div>
      );

    return (
      <div className={s.container}>
        <header className={s.header}>
          <h2 className={t.title__main}><a href="#/">{title}</a></h2>
        </header>
        {content}
      </div>
    );
  }
}

export default Base;