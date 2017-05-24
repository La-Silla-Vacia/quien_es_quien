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
  currentPerson: false,
  breadcrumbs: []
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
    this.getBreadcrumbs();
  }

  componentDidMount() {
    this.setState({ width: this.props.width });
    window.addEventListener('popstate', () => {
      const newLocation = getHash(window.location.hash);
      this.setState({ location: newLocation });
      this.getBreadcrumbs();
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

    const people = this.formatPerson(rawPeople);
    const connections = this.formatConnections(rawConnections);

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
        color: (color) ? color.replace('0.45', 1).replace('0.3', 1) : color,
        id,
        size,
        source,
        subcategory,
        target
      };
      connections.push(connection);
    });
    return connections;
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
    const url = re.exec(location);

    if (url) {
      const ids = url[1].split(',').filter(String);

      const items = [
        {
          'title': 'Inicio',
          'link': '#/'
        }
      ];

      let link = '#/person/';
      ids.map((id) => {
        const person = peopleLookup[id];
        if (person) {
          const { title, id } = person;
          link += `${id},`;
          items.push({ title, link })
        }
      });

      return items;
      // this.setState({ breadcrumbs: items });
    }
  }

  personView(props) {
    const { peopleLookup, connectionsLookup, params, breadcrumbs } = props;
    const ids = params.id.split(',').filter(String);
    const id = ids[ids.length - 1];
    const person = peopleLookup[id];
    const connections = (connectionsLookup[id]) ? connectionsLookup[id] : [];

    const types = [];
    if (connections)
      connections.map((rawConnection) => {
        const { category, target, color } = rawConnection;
        const connection = peopleLookup[target];
        let inArray;
        types.map((type) => {
          if (type.name === category) {
            inArray = true;
            type.connections.push(connection);
          }
        });
        // console.log(rawConnection);
        if (!inArray) types.push({ name: category, color, connections: [connection] });
      });

    return (
      <PersonView person={person} breadcrumbs={breadcrumbs} connections={types} />
    )
  }

  render(props, state) {
    const { people } = state;
    const { title } = strings;
    const items = this.getBreadcrumbs();

    let content;
    if (people.length) {
      content = (
        <div className={s.wrap}>
          <Breadcrumbs items={items} />
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