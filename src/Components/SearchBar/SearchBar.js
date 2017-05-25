import React, { Component } from 'react';
import s from './SearchBar.css';

import strings from '../../strings.json';

export default class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      value: ''
    };

    this.handlesChange = this.handlesChange.bind(this);
  }

  handlesChange(event) {
    const value = event.target.value;
    this.setState({ value: value });
    this.props.onChange(value);
  }

  render() {
    const { value } = this.state;

    return (
      <form className={s.container}>
        <input value={value} type="text" className={s.input} placeholder={strings.searchText}
               onInput={this.handlesChange} />
        <svg className={s.icon} viewBox="0 0 24 24">
          <circle className={s.icon__circle} cx="9" cy="9" r="8.5" />
          <line className={s.icon__line} x1="15" y1="15" x2="23.5" y2="23.5" />
        </svg>
      </form>
    )
  }
}
