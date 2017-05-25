import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';

import TableView from './Pages/TableView';
import PersonView from './Pages/PersonView';

import Breadcrumbs from './Components/Breadcrumbs';

import s from './base.css';
import t from './_typography.css';
import strings from './strings.json';

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
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    this.setState({ width: this.props.width });
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
      const {
        id = 0,
        label = 'Sin definir',
        Ocupación = 'Sin definir',
        imgurl,
        perfilito = ['Sin definir'],
        slug,
        nconnections = 0,
        nRelPersonal = 0,
        nRelLaboral = 0,
        nRelRivalidad = 0,
        nRelAlianza = 0,
        hilos
      } = rawPerson;
      const person = {
        id,
        title: label,
        occupation: Ocupación,
        imgurl,
        bio: perfilito,
        slug,
        numberOfConnections: nconnections,
        numberOfPersonalConnections: nRelPersonal,
        numberOfWorkConnections: nRelLaboral,
        numberOfRivalryConnections: nRelRivalidad,
        numberOfAllianceConnections: nRelAlianza,
        connections: hilos,
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