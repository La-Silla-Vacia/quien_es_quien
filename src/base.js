import { h, render, Component } from 'preact';
import cx from 'classnames';

import Searchbar from './Components/Searchbar';
import Checkbox from './Components/Checkbox';

import s from './base.css';
import t from './_typography.css';
import strings from './strings.json';

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      people: [],
      show: 5,
      connections: []
    }
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

    const people = [];
    const connections = [];

    rawPeople.map((rawPerson) => {
      console.log(rawPerson);
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
        children: hilos
      };

      people.push(person);
    });

    this.setState({ people, connections });
  }

  handleClick(e) {
    const preventClick = e.target.classList.contains('preventClick');
    if (preventClick) return;
    console.log('hi!');
  }

  getRows() {
    const { people, show } = this.state;
    return people.map((person, index) => {
      if (index > show - 1) return;
      console.log(person);
      const { id, title, occupation, imgurl, numberOfConnections } = person;
      return (
        <div tabIndex={0} onClick={this.handleClick} key={id} href="#" className={s.row}>
          <div className={cx(s.cell)}>
            <Checkbox id={id} labelHidden>{title}</Checkbox>
          </div>
          <div className={s.cell}>
            <div className={s.inner}>
              <img className={s.photo} src={imgurl} width={40} alt="" />
              <div>
                <h3 className={s.name}>{title}</h3>
                <span className={s.occupation}>{occupation}</span>
              </div>
            </div>
          </div>
          <div className={s.cell}>
            {numberOfConnections}
          </div>
        </div>
      )
    });
  }

  render(props, state) {
    const { title } = strings;
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <header className={s.header}>
          <h2 className={t.title__main}>{title}</h2>
        </header>
        <div className={s.wrap}>
          <Searchbar />
          <div className={s.table}>
            <div className={s.row}>
              <div className={s.head}>Comparar</div>
              <div className={s.head}>Información básica</div>
              <div className={s.head}>Cantidad de conexiones</div>
            </div>

            {rows}

          </div>
        </div>
      </div>
    )
  }
}