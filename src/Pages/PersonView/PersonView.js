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
    this.setState({show});
  }

  getPeople(name, children) {
    return children.map((child, index) => {
      return (
        <Person className={s.person} {...child} profile collapsed />
      )
    });
  }

  getConnections() {
    const { connections } = this.props;

    return connections.map((connection) => {
      const { name, children } = connection;

      const people = this.getPeople(name, children);
      return (
        <li>
          {name}
          <ul>
            {people}
          </ul>
        </li>
      )
    });
  }

  render(props, state) {
    const { person } = props;
    const connections = this.getConnections();

    return (
      <div className={s.container}>
        <Person className={s.person} {...person} profile />
        <ul>
          {connections}
        </ul>
      </div>
    )
  }
}