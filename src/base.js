import React, { Component } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import Redirect from './Components/Redirect';

import TableView from './Views/TableView';
import PersonView from './Views/PersonView';
import CompareView from './Views/CompareView';

import Breadcrumbs from './Components/Breadcrumbs';

import getMutualConnections from './functions/getMutualConnections';

import s from './base.css';
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

    this.changeRoute = this.changeRoute.bind(this);
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    if (typeof quien_es_quien__data === 'object') {
      const data = quien_es_quien__data;
      if (data.show) {
        setTimeout(() => {
          this.setState({ 'redirectTo': data.show });
        }, 60);
      }
      data.switch = this.changeRoute;
    }
  }

  changeRoute(to) {
    this.setState({ redirected: false, redirectTo: to });
    // console.log('changing route to: ', to);
  }

  setData() {
    const uri = 'http://lasillavacia.com/quienesquien/personas/nodesjsonv2';
    const now = Math.floor(new Date().getTime() / 1000);
    const retrieveData = localStorage.getItem('qesq_data');
    const dataTime = localStorage.getItem('qesq_data-time');
    if (retrieveData && dataTime) {
      // if it's newer than 15 minutes, show
      if (dataTime > now - 900) {
        setTimeout(() => {
          this.formatData(JSON.parse(retrieveData));
        }, 50);
      } else {
        this.fetchData(uri);
      }
    } else {
      // console.log('doesnt exist', now);
      this.fetchData(uri);
    }
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        return response.json();
      }).then((json) => {
      const now = Math.floor(new Date().getTime() / 1000);
      localStorage.setItem('qesq_data', JSON.stringify(json));
      localStorage.setItem('qesq_data-time', now);
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
      // console.log(connections[i]);
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
      } else if (changed > (now - dayInSeconds * 21)) {
        labels.push('Actualizado');
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
      if (a.labels.length === b.labels.length) {
        return (a.numberOfConnections < b.numberOfConnections) ? 1 : ((b.numberOfConnections < a.numberOfConnections) ? -1 : 0);
      } else {
        return (a.labels.length < b.labels.length) ? 1 : ((b.labels.length < a.labels.length) ? -1 : 0);
      }
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
        color = 'rgb(86, 96, 225)';
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
    const { peopleLookup, connectionsLookup } = props;
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

    const breads = ids.join(',');

    return (
      <PersonView person={person} breadcrumbs={breads} connections={types} />
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
    let customState = {
      people: state.people,
      connections: state.connections,
      connectionsLookup: state.connectionsLookup,
      peopleLookup: state.peopleLookup
    };
    if (ids) {
      const originalPeople = state.people;
      const nPeople = [];
      for (let person of originalPeople) {
        if (ids.indexOf(person.id) !== -1) nPeople.push(person);
      }
      customState.people = nPeople;
      customState.allPeople = originalPeople;
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

  getRedirect(params) {
    return (
      <Redirect {...this.state} params={params} />
    )
  }

  render() {
    const { people, peopleLookup } = this.state;
    // console.log(people);
    // const redirect = this.getRedirect();
    let content = (people.length) ?
      (
        <div className={s.wrap}>
          <MemoryRouter
            {...this.state}
          >
            <div>
              <Route path="/" component={this.getRedirect.bind(this)} />
              <Route path="/person/:id" component={this.breadCrumbs.bind(true, peopleLookup)} />
              <Route path="/compare/:id" component={this.breadCrumbs.bind(true, false)} />
              <Route exact path="/" component={this.tableView.bind(true, this.state)} />
              <Route exact path="/hilos/:id" component={this.hilosView.bind(true, this.state)} />
              <Route exact path="/limit/:id" component={this.tableView.bind(true, this.state)} />
              <Route exact path="/person/:id" component={this.personView.bind(true, this.state)} />
              <Route exact path="/compare/:id" component={this.compareView.bind(this, this.state)} />
            </div>
          </MemoryRouter>
        </div>
      ) : (
        <div className={s.wrap}>
          <em>El "quién es quién" está siendo cargado</em>
        </div>
      );

    return (
      <div className={s.container}>
        {content}
      </div>
    );
  }
}

export default Base;