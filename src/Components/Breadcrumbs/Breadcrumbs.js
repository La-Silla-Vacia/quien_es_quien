import { h, render, Component } from 'preact';
import Breadcrumb from './Breadcrumb';

import s from './Breadcrumbs.css';

export default class Breadcrumbs extends Component {
  getLabels() {
    const { items } = this.props;
    return items.map((item, index) => {
      return (
        <Breadcrumb key={index}>{item}</Breadcrumb>
      )
    });
  }

  render(props, state) {
    if (!props.items) return;
    const labels = this.getLabels();
    return (
      <ul className={s.container}>
        {labels}
      </ul>
    )
  }
}