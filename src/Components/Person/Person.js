import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './Person.css';
import Checkbox from "../Checkbox/Checkbox";
import Labels from "../Labels/Labels";

export default class Person extends Component {
  render(props, state) {
    const { id, title, occupation, imgurl, numberOfConnections, lastUpdate } = props;
    const labels = ['Información nueva'];
    if (lastUpdate) labels.push('Ahora tendencia');

    return (
      <div tabIndex={0} onClick={this.handleClick} key={id} href="#" className={s.container}>
        <div className={cx(s.cell)}>
          <Checkbox labelHidden>{title}</Checkbox>
        </div>
        <div className={s.cell}>
          <div className={s.inner}>
            <img className={s.photo} src={imgurl} width={40} alt="" />
            <div>
              <h3 className={s.name}>{title}</h3>
              {/*<span className={s.occupation}>{occupation}</span>*/}
            </div>
          </div>
        </div>
        <div className={s.cell}>
          <span className={s.occupation}>{occupation}</span>
        </div>
        <div className={s.cell}>
          {numberOfConnections}
        </div>
        <div className={s.cell}>
          <Labels items={labels} />
        </div>
      </div>
    )
  }
}