import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './TableView.css';
import Person from "../../Components/Person/Person";

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      show: 50,
    }
  }

  handleClick(e) {
    const preventClick = e.target.classList.contains('preventClick');
    if (preventClick) return;
    console.log('hi!');
  }

  getRows() {
    const { show } = this.state;
    const { people } = this.props;
    return people.map((person, index) => {
      if (index > show - 1) return;

      return (
        <Person {...person} />
      )
    });
  }

  render(props, state) {
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <div className={s.row}>
          <div className={s.head}>Comparar</div>
          <div className={s.head}>Información básica</div>
          <div className={s.head}>Ocupación</div>
          <div className={s.head}>Total conexiones</div>
          <div className={s.head} />
        </div>

        {rows}

      </div>
    )
  }
}