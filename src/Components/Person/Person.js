import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import s from './Person.css';
import t from '../../_typography.css';
import Checkbox from '../Checkbox';
import Labels from '../Labels';

export default class Person extends Component {
  constructor() {
    super();
    this.state = {
      size: 400,
      width: 400,
      collapser: false,
      collapsed: true
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    const { collapsed, componentDidMount, title } = this.props;
    if (collapsed) this.setState({ collapser: true });
    if (componentDidMount) componentDidMount(title);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    const element = this.rootElement;
    if (!element) return;
    const width = element.offsetWidth;
    this.formatSize(width);
  }

  formatSize(size) {
    // console.log(size);
    let sizeName;
    if (size > 1182) {
      sizeName = 1
    } else if (size > 1088) {
      sizeName = 2
    } else {
      sizeName = 10
    }
    // console.log(size, sizeName);
    this.setState({ size: sizeName, width: size });
  }

  getBio() {
    const { collapser, collapsed } = this.state;
    const { bio, compact, slug } = this.props;
    if (collapser && collapsed || compact) return;

    return (
      <div className={s.bio}>
        <div dangerouslySetInnerHTML={{ __html: bio }} />
        <a href={`http://lasillavacia.com/${slug}`} className={t.link}>+ VER PERFIL</a>
      </div>
    )
  }

  handleClick() {
    const { compact, id } = this.props;
    const { collapser, collapsed } = this.state;
    if (compact) window.location = window.location + `,${id}`;
    if (!collapser) return;
    this.setState({ collapsed: !collapsed });
  }

  handleSelect(e) {
    const { id, onSelect } = this.props;
    if (onSelect) onSelect(id, e);
  }

  render() {
    const { size, width } = this.state;
    const { id, title, occupation, imgurl, numberOfConnections, className, profile, color, children, compact, labels, breads } = this.props;
    const bio = this.getBio();

    const nameAndOccupation = (
      <div className={s.overflow}>
        <h3 className={s.name}>{title}</h3>
        <span className={cx(s.text, { [s.hidden]: size <= 2 })}>{occupation}</span>
      </div>
    );

    const style = (color) ? { borderLeftColor: color } : {};
    if (compact) {
      return (
        <Link
          className={cx(className, s.container, s.profile, { [s.hasLabel]: color }, { [s.compact]: compact })}
          to={`${breads},${id}`}
          key={id}
          style={style}
          ref={(person) => {
            this.rootElement = person;
          }}
        >
          <header className={s.header}>
            <div className={s.photo} style={{ backgroundImage: `url(${imgurl})` }} />
            {nameAndOccupation}
          </header>
          {bio}
          {children}
        </Link>
      )
    } else if (profile) {
      return (
        <div
          className={cx(className, s.container, s.profile, { [s.hasLabel]: color }, { [s.compact]: compact })}
          onClick={this.handleClick}
          key={id}
          style={style}
          ref={(person) => {
            this.rootElement = person;
          }}
        >
          <header className={s.header}>
            <div className={s.photo} style={{ backgroundImage: `url(${imgurl})` }} />
            {nameAndOccupation}
          </header>
          {bio}
          {children}
        </div>
      )
    }

    const occupationElement = (width < 1088) ? false : (
      <div className={cx(s.cell, s['cell--occupation'])}>
        <span className={s.text}>{occupation}</span>
      </div>
    );

    const labelsElement = (width < 625) ? false : (
      <div className={cx(s.cell, s['cell--labels'])}>
        <Labels items={labels} />
      </div>
    );

    const connectionElement = (width < 456) ? false : (
      <div className={cx(s.cell, s['cell--connections'], { [s.grow]: width < 625 })}>
        <span className={s.text}>{numberOfConnections} {( width > 768) ? 'conexiones' : false}</span>
      </div>
    );

    return (
      <Link
        key={id}
        to={`/person/${id}`}
        className={cx(className, s.container)}
        ref={(person) => {
          this.rootElement = person;
        }}
      >
        <div className={cx(s.cell)}>
          <Checkbox callback={this.handleSelect} labelHidden>{title}</Checkbox>
        </div>
        <div className={cx(s.cell, s['cell--informacionBasica'], { [s.grow]: size > 2 }, { [s.xgrow]: width < 625 })}>
          <div className={s.photo} style={{ backgroundImage: `url(${imgurl})` }} />
          {nameAndOccupation}
        </div>
        {occupationElement}
        {connectionElement}
        {labelsElement}
      </Link>
    )
  }
}