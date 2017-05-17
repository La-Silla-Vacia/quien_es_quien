import { h, render, Component } from 'preact';
import { Router, Route } from 'preact-enroute';

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
  connections: []
};

import TableView from './Pages/TableView';

import Searchbar from './Components/Searchbar';

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

    this.setState({ people, connections });
  }

  getChildContext() {
    return {
      navigate: path => {
        window.location.hash = path;
        this.setState({ location: path });
      },
    };
  }

  render(props, state) {
    const { people } = state;
    const { title } = strings;

    if (!people.length) {
      return (
        <div>Loading</div>
      )
    } else {
      return (
        <div className={s.container}>
          <header className={s.header}>
            <h2 className={t.title__main}>{title}</h2>
          </header>
          <div className={s.wrap}>
            <Searchbar />
            <Router {...state}>
              <Route path="/" {...people} component={TableView} />
              <Route path="/abc" component={TableView} />
            </Router>
          </div>
        </div>
      );
    }
  }
}

export default Base;