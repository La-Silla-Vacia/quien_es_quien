import React, { Component } from 'react';
import Breadcrumb from './Breadcrumb';

import s from './Breadcrumbs.css';

export default class Breadcrumbs extends Component {
  getLabels() {
    const { peopleLookup, params } = this.props;
    const url = params.match.params.id;

    const items = [
      {
        'title': 'Inicio',
        'link': '/'
      }
    ];

    if (url) {
      const ids = url.split(',').filter(String);

      let link = '/person/';
      ids.map((id) => {
        const person = peopleLookup[id];
        if (person) {
          const { title, id } = person;
          link += `${id},`;
          items.push({ title, link })
        }
      });
    }

    return items.map((item, index) => {
      const {title, link} = item;
      return (
        <Breadcrumb key={index} href={link}>{title}</Breadcrumb>
      )
    });
  }

  render() {
    const labels = this.getLabels();
    return (
      <ul className={s.container}>
        {labels}
      </ul>
    )
  }
}