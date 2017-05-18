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
  connections: [],
  width: 400,
  peopleLookup: {}
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

    const lookup = {};
    for (let i = 0, len = people.length; i < len; i++) {
      lookup[people[i].id] = people[i];
    }

    this.setState({ people, peopleLookup: lookup, connections });
  }

  getChildContext() {
    return {
      navigate: path => {
        window.location.hash = path;
        this.setState({ location: path });
      },
    };
  }

  personView(props, state) {
    const { peopleLookup, params } = props;

    const id = params.id;
    const person = peopleLookup[id];

    return (
      <PersonView person={person} />
    )
  }

  render(props, state) {
    const { people } = state;
    const { title } = strings;

    let content;
    if (people.length) {
      content = (
        <div className={s.wrap}>
          <SearchBar />
          <Breadcrumbs items={['Home', 'Ulribe']} />
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