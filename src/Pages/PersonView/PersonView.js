import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './PersonView.css';
import Person from "../../Components/Person/Person";

export default class PersonView extends Component {

  render(props, state) {
    const {person} = props;

    return (
      <div className={s.container}>
        <Person className={s.person} {...person} profile />
      </div>
    )
  }
}