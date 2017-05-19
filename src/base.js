import { h, render, Component } from 'preact';
import { Router, Route } from 'preact-enroute';
import pathToRegexp from 'path-to-regexp';

const getHash = hash => {
  if (typeof hash === 'string' && hash.length) {
    if (hash.substring(0, 1) === '#') {
      return hash.substring(1);
    }
    return hash;
  }
  return '/';
};

const state = {
  location: getHash(window.location.hash),
  people: [],
  connections: [],
  width: 400,
  peopleLookup: {},
  currentPerson: false
};

import TableView from './Pages/TableView';
import PersonView from './Pages/PersonView';

import SearchBar from './Components/SearchBar';
import Breadcrumbs from './Components/Breadcrumbs';

import s from './base.css';
import t from './_typography.css';
import strings from './strings.json';

class Base extends Component {

  constructor() {
    super();
    this.state = state;
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    this.setState({ width: this.props.width });
    window.addEventListener('popstate', () => {
      const newLocation = getHash(window.location.hash);
      this.setState({ location: newLocation });
    });
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

    const people = [];
    const connections = [];

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
        children: hilos,
        lastUpdate: '20170510'
      };

      people.push(person);
    });

    rawConnections.map((rawConnection) => {
      const {
        category,
        color,
        id,
        size,
        source,
        subcategory,
        target
      } = rawConnection;
      const connection = {
        category,
        color,
        id,
        size,
        source,
        subcategory,
        target
      };
      connections.push(connection);
    });

    const peopleLookup = {};
    for (let i = 0, len = people.length; i < len; i++) {
      peopleLookup[people[i].id] = people[i];
    }

    const connectionsLookup = {};
    for (let i = 0, len = connections.length; i < len; i++) {
      const source = connections[i].source;
      if (!connectionsLookup[source]) {
        connectionsLookup[source] = [];
      }
      connectionsLookup[source].push(connections[i]);
    }

    this.setState({ people, peopleLookup, connections, connectionsLookup });
  }

  getChildContext() {
    return {
      navigate: path => {
        window.location.hash = path;
        this.setState({ location: path });
      },
    };
  }

  getBreadcrumbs() {
    const { peopleLookup, location } = this.state;
    const keys = [];
    const re = pathToRegexp('/person/:id', keys);
    const personId = re.exec(location);
    if (personId) {
      const person = peopleLookup[personId[1]];
      if (!person) return;
      const { title, id } = person;
      const items = [
        {
          'title': 'Inicio',
          'link': '#/'
        },
        {
          'title': title,
          'link': `#/person/${id}`
        }
      ];
      return (
        <Breadcrumbs items={items} />
      )
    }
  }

  personView(props, state) {
    const { peopleLookup, connectionsLookup, params } = props;

    const id = params.id;
    const person = peopleLookup[id];
    const connections = connectionsLookup[id];

    const types = [];
    connections.map((rawConnection) => {
      const { category, target } = rawConnection;
      const connection = peopleLookup[target];
      let inArray;
      types.map((type) => {
        if (type.name === category) {
          inArray = true;
          type.children.push(connection);
        }
      });
      if (!inArray) types.push({name: category, children: [connection]});
    });

    return (
      <PersonView person={person} connections={types} />
    )
  }

  render(props, state) {
    const { people } = state;
    const { title } = strings;
    const breadcrumbs = this.getBreadcrumbs();

    let content;
    if (people.length) {
      content = (
        <div className={s.wrap}>
          <SearchBar />
          {breadcrumbs}
          <Router {...state}>
            <Route path="/" {...people} component={TableView} />
            <Route path="/person/:id" component={this.personView} />
          </Router>
        </div>
      )
    } else {
      content = (
        <div className={s.wrap}>
          <em>El "quién es quién" está siendo cargado</em>
        </div>
      )
    }

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