import React, { Component } from 'react';
import cx from 'classnames';
import s from './Checkbox.css';

class Checkbox extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { callback } = this.props;
    if (callback) callback(e.target.checked);
  }

  render() {
    const { id, labelHidden, children } = this.props;
    return (
      <div className={cx(s.container, { [s.noLabel]: labelHidden })} onClick={this.handleClick}>
        <input className={cx(s.input)} onChange={this.handleChange} id={`select-${id}`} type="checkbox" />
        <label className={cx(s.label)} htmlFor={`select-${id}`}>
          <span className={s.content}>{children}</span>
        </label>
      </div>
    )
  }
}


export default Checkbox;