import React, { Component } from 'react';
import cx from 'classnames';

import s from './CompareView.css';
import t from '../../_typography.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

export default class PersonView extends Component {

  constructor() {
    super();

    this.state = {
      show: 12,
      width: 320,
      height: 568,
      searchText: '',
      rerender: false,
      duration: 200
    };

    this.connections = {};

    this.handleResize = this.handleResize.bind(this);
    this.handleQuickSearch = this.handleQuickSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentDidUpdate(newProps) {
    if (this.props !== newProps) {
      this.rerender();
    }
  }

  handleResize() {
    const element = this.rootElement;
    if (element)
      this.setState({ width: element.offsetWidth, height: element.offsetHeight });
  }

  showMore() {
    let { show } = this.state;
    show += 5;
    this.setState({ show });
    this.rerender(10);
  }

  handleQuickSearch(event) {
    const value = event.target.value;
    this.handleSearchChange(value);
  }

  getPeople(connections) {
    const { show, searchText } = this.state;
    return connections.map((child) => {
      const { id } = child;
      if (searchText &&
        child.title.toLowerCase().indexOf(searchText) === -1 &&
        child.occupation.toLowerCase().indexOf(searchText) === -1 &&
        name.toLowerCase().indexOf(searchText) === -1
      ) return;
      if (show <= i) return;
      if (!this.connections[name]) this.connections[name] = { targets: [] };
      return (
        <Person key={id} {...child} profile compact />
      )
    });
  }

  getConnections() {
    const { show } = this.state;
    const { connections } = this.props;
    if (!connections.length) {
      return (
        <h2 className={s.message}>No hay conexiones mutuas</h2>
      )
    }

    const rawPeople = this.getPeople(connections);
    const people = [];
    for (let i of rawPeople)
      i && people.push(i); // copy each non-empty value to the 'temp' array
    if (!people.length) return;

    const viewMore = (people.length === connections.length || people.length < show);
    const color = 'red';
    const viewMoreButton = (viewMore) ? false : (
      <button className={s.group__button} onClick={this.showMore.bind(this, name)}>
        <svg viewBox="0 0 24 9">
          <line x1="1" y1="1" x2="12.25" y2="8" stroke={color} />
          <line x1="11.75" y1="8" x2="23" y2="1" stroke={color} />
        </svg>
      </button>);

    return (
      <div className={cx(s.group, { [s['group--margin']]: viewMore })}>
        <h4 className={t.sectionTitle}>{name}</h4>
        {people}
        {viewMoreButton}
      </div>
    )
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
    this.rerender();
  }

  rerender(time) {
    const duration = (time) ? time : 10;
    setTimeout(() => {
      this.setState({ rerender: !this.state.rerender })
    }, duration);
  }

  getPersons() {
    const { persons } = this.props;
    return persons.map((person) => {
      return (
        <Person key={person.id} className={s.person} {...person} profile />
      )
    });
  }

  render() {
    const { width, rerender } = this.state;
    const connections = this.getConnections();

    const persons = this.getPersons();
    const heading = (width < 670) ? persons : (
      <div className={s.leftGroup}>
        {persons}
      </div>
    );

    return (
      <div className={s.container}>
        {rerender}
        <SearchBar onChange={this.handleSearchChange} />
        <div className={cx(s.wrap, { [s['wrap--vertical']]: width < 670 })} ref={(el) => {
          this.rootElement = el
        }}>
          {heading}
          <div className={cx(s.connections, { [s.margin]: width < 670 })}>
            {connections}
          </div>
        </div>
      </div>
    )
  }
}