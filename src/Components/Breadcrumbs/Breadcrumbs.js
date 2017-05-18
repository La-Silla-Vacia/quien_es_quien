import { h, render, Component } from 'preact';
import Breadcrumb from './Breadcrumb';

import s from './Breadcrumbs.css';

export default class Breadcrumbs extends Component {
  getLabels() {
    const { items } = this.props;
    return items.map((item, index) => {
      const {title, link} = item;
      return (
        <Breadcrumb key={index} href={link}>{title}</Breadcrumb>
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