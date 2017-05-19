import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './PersonView.css';
import Person from "../../Components/Person/Person";

export default class PersonView extends Component {

  constructor() {
    super();

    this.state = {
      show: []
    }
  }

  componentDidMount() {
    const { show } = this.state;
    const { connections } = this.props;
    connections.map((connection) => {
      show[connection.name] = 5;
    });
    this.setState({ show });
  }

  showMore(category) {
    const { show } = this.state;
    show[category] += 5;
    this.setState({ show });
  }

  getPeople(name, children) {
    const { show } = this.state;
    const peopleToShow = (show[name]) ? show[name] : 5;
    return children.map((child, index) => {
      if (peopleToShow === index) {
        return (<div onClick={this.showMore.bind(this, name)}>Ver mas</div>);
      } else if (peopleToShow - 1 < index) {
        return;
      }
      return (
        <Person className={s.person} {...child} profile collapsed />
      )
    });
  }

  getTitles() {
    const { connections } = this.props;
    return connections.map((connection) => {
      const { name } = connection;
      return (
        <h3>{name}</h3>
      )
    });
  }

  getConnections() {
    const { connections } = this.props;

    return connections.map((connection) => {
      const { name, children } = connection;

      const people = this.getPeople(name, children);
      return (
        <div className={s.group}>
          {people}
        </div>
      )
    });
  }

  render(props, state) {
    const { person } = props;
    const titles = this.getTitles();
    const connections = this.getConnections();

    return (
      <div className={s.container}>
        <Person className={s.person} {...person} profile />
        <div className={s.title}>
          {titles}
        </div>
        <div className={s.connections}>
          {connections}
        </div>
      </div>
    )
  }
}