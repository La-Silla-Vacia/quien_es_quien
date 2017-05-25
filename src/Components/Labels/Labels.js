import React, { Component } from 'react';
import Label from './Label';

import s from './Labels.css';

export default class Labels extends Component {
  getLabels() {
    const { items } = this.props;
    return items.map((item, index) => {
      return (
        <Label key={index}>{item}</Label>
      )
    });
  }

  render(props, state) {
    const labels = this.getLabels();
    return (
      <ul className={s.container}>
        {labels}
      </ul>
    )
  }
}