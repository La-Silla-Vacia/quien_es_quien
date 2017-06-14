import React, { Component } from 'react';
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

    // split on double line breaks
// note that we actually split on triple to account for the trailing
// line break at the end of a paragraph
    let doc = bio[0];
    const parts = doc.split("\n");

// rejoin with paragraph tags
    doc = parts.join("</p><p>");

// wrap the entire thing in open/close paragraphs
    doc = "<p>" + doc + "</p>";

    return (
      <div className={s.bio}>
        <div dangerouslySetInnerHTML={{ __html: doc }} />
        <a href={`/${slug}`} className={t.link}>+ VER PERFIL</a>
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

  render() {
    const { size, width } = this.state;
    const { id, title, occupation, imgurl, numberOfConnections, lastUpdate, className, profile, color, children, compact } = this.props;
    const labels = ['Información nueva'];
    if (lastUpdate) labels.push('Ahora tendencia');

    const bio = this.getBio();

    const style = (color) ? { borderLeftColor: color } : {};
    if (profile) {
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
            <div className={s.overflow}>
              <h3 className={s.name}>{title}</h3>
              <span className={cx(s.text, { [s.hidden]: size <= 2 })}>{occupation}</span>
            </div>
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
      <a
        tabIndex={0}
        key={id}
        href={`#/person/${id}`}
        className={cx(className, s.container)}
        ref={(person) => {
          this.rootElement = person;
        }}
      >
        <div className={cx(s.cell)}>
          <Checkbox labelHidden>{title}</Checkbox>
        </div>
        <div className={cx(s.cell, s['cell--informacionBasica'], { [s.grow]: size > 2 }, { [s.xgrow]: width < 625 })}>
          <div className={s.photo} style={{ backgroundImage: `url(${imgurl})` }} />
          <div className={s.nameAndOccupation}>
            <h3 className={s.name}>{title}</h3>
            <span className={cx(s.text, { [s.hidden]: size <= 2 })}>{occupation}</span>
          </div>
        </div>
        {occupationElement}
        {connectionElement}
        {labelsElement}
      </a>
    )
  }
}