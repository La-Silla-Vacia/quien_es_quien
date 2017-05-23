import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './Person.css';
import Checkbox from "../Checkbox/Checkbox";
import Labels from "../Labels/Labels";

export default class Person extends Component {
  constructor() {
    super();
    this.state = {
      size: 400,
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

    this.setState({ size: sizeName });
  }

  getBio() {
    const { collapser, collapsed } = this.state;
    const { bio, compact } = this.props;
    if (collapser && collapsed || compact) return;
    return (
      <div dangerouslySetInnerHTML={{ __html: bio }} />
    )
  }

  handleClick() {
    const { compact, id } = this.props;
    const { collapser, collapsed } = this.state;
    if (compact) window.location = window.location + `,${id}`;
    if (!collapser) return;
    this.setState({ collapsed: !collapsed });
  }

  render(props, state) {
    const { size, collapser } = state;
    const { id, title, occupation, imgurl, numberOfConnections, lastUpdate, className, profile, color, children, compact } = props;
    const labels = ['Información nueva'];
    if (lastUpdate) labels.push('Ahora tendencia');

    const bio = this.getBio();

    const style = (color) ? { borderLeftColor: color } : {};
// console.log('c', connections);
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
        <div className={s.cell}>
          <div className={s.inner}>
            <div className={s.photo} style={{ backgroundImage: `url(${imgurl})` }} />
            <div>
              <h3 className={s.name}>{title}</h3>
              <span className={cx(s.text, { [s.hidden]: size <= 2 })}>{occupation}</span>
            </div>
          </div>
        </div>
        <div className={cx(s.cell, { [s.hidden]: size > 2 })}>
          <span className={s.text}>{occupation}</span>
        </div>
        <div className={s.cell}>
          <span className={s.text}>{numberOfConnections}</span>
          <span className={cx(s.text, { [s.hidden]: size > 1 })}> conexiones</span>
        </div>
        <div className={s.cell}>
          <Labels items={labels} />
        </div>
      </a>
    )
  }
}