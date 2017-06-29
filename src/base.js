import React, { Component } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';

import TableView from './Views/TableView';
import PersonView from './Views/PersonView';
import CompareView from './Views/CompareView';

import Breadcrumbs from './Components/Breadcrumbs';

import getMutualConnections from './functions/getMutualConnections';

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
      currentPerson: false,
      redirectTo: false,
      redirected: false
    };
    self = this;
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    if (typeof quien_es_quien__data === 'object') {
      const data = quien_es_quien__data;
      if (data.show) {
        this.setState({ 'redirectTo': data.show });
      }
    }
  }

  setData() {
    this.fetchData('http://desarrollo.lasillavacia.com/quienesquien/personas/nodesjsonv2');
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
    const people = rawPeople.map((rawPerson) => {
      const labels = [];
      const now = Math.floor(new Date().getTime() / 1000);
      const changed = Number(rawPerson.changed);
      const created = Number(rawPerson.created);
      const views = Number(rawPerson.views);
      const dayInSeconds = 86400;
      if (created > (now - dayInSeconds * 21)) {
        labels.push('Nuevo');
        // console.log(rawPerson.name, created);
      } else if (changed > (now - dayInSeconds * 21)) {
        labels.push('Actualizado');
        // console.log(rawPerson.name, changed);
      }

      if (views > 30000) {
        labels.push('Popular');
        // console.log(rawPerson.name, views);
      }

      return {
        id: rawPerson.id,
        title: rawPerson.name,
        occupation: (rawPerson.occupation) ? rawPerson.occupation : 'Sin definir',
        imgurl: rawPerson.photo,
        bio: (rawPerson.perfil) ? rawPerson.perfil : ['Sin definir'],
        slug: rawPerson.slug,
        numberOfConnections: rawPerson.nConnections,
        hilos: rawPerson.hilos,
        labels: labels,
        views
      };
    });
    people.sort(function (a, b) {
      return (a.numberOfConnections < b.numberOfConnections) ? 1 : ((b.numberOfConnections < a.numberOfConnections) ? -1 : 0);
    });
    people.sort(function (a, b) {
      return (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0);
    });

    return people;
  }

  formatConnections(rawConnections) {
    const connections = [];
    rawConnections.map((rawConnection, index) => {
      const { nombrecategoria, sourceid, targetid, nombretipo } = rawConnection;
      let color = "rgb(153, 130, 188)";
      let category = nombrecategoria;
      if (['Familia', 'Amistad'].indexOf(nombrecategoria) !== -1) {
        category = 'Relación personal';
        color = 'rgb(249, 191, 118)';
      } else if (['Trabajo'].indexOf(nombrecategoria) !== -1) {
        category = 'Relación laboral';
        color = 'rgb(148, 178, 197)';
      } else if (['Alianza'].indexOf(nombrecategoria) !== -1) {
        color = 'rgb(153, 130, 188)';
      } else if (['Rivalidad'].indexOf(nombrecategoria) !== -1) {
        color = 'rgb(251, 128, 114)';
      }

      const connection = {
        category: category,
        color: color,
        name: nombretipo,
        id: index + 1,
        source: sourceid,
        target: targetid
      };
      connections.push(connection);
      // console.log(connection);
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
      if (!peopleLookup[target]) return;
      const connection = (peopleLookup[target].id === id) ? peopleLookup[source] : peopleLookup[target];
      if (!connection) return;
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
    const connections = getMutualConnections(ids, props);

    return (
      <CompareView persons={persons} connections={connections} />
    )
  }

  tableView(state, params) {
    const rawIds = params.match.params.id;
    const ids = (rawIds) ? rawIds.split(',').filter(String) : false;
    let customState = state;
    if (ids) {
      const originalPeople = state.people;
      const people = [];
      for (let person of originalPeople) {
        if (ids.indexOf(person.id) !== -1) people.push(person);
      }
      customState.people = people;
    }
    return (
      <TableView {...customState} />
    )
  }

  hilosView(state, params) {
    const id = params.match.params.id;
    let customState = state;
    if (id) {
      const originalPeople = state.people;
      const people = [];
      for (let person of originalPeople) {
        if (person.hilos.indexOf(id) !== -1) people.push(person);
        // if(ids.indexOf(person.id) !== -1) ;
      }
      customState.people = people;
    }
    return (
      <TableView {...customState} />
    )
  }

  render() {
    const { people, peopleLookup, redirected, redirectTo } = this.state;
    const { title } = strings;

    let content = (people.length) ?
      (
        <div className={s.wrap}>
          <HashRouter {...this.state}>
            <div>
              {(!redirected && redirectTo) ? (<Redirect to={redirectTo} push />) : false}
              <Route path="/person/:id" component={this.breadCrumbs.bind(true, peopleLookup)} />
              <Route exact path="/" component={this.tableView.bind(true, this.state)} />
              <Route exact path="/hilos/:id" component={this.hilosView.bind(true, this.state)} />
              <Route exact path="/limit/:id" component={this.tableView.bind(true, this.state)} />
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