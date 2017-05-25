import React, { Component } from 'react';
import cx from 'classnames';

import s from './PersonView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";
import ConnectionWires from "../../Components/ConnectionWires/ConnectionWires";

export default class PersonView extends Component {

  constructor() {
    super();

    this.state = {
      show: [],
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
    this.formatTypes();
    window.addEventListener('resize', this.handleResize);
  }

  formatTypes() {
    const { show } = this.state;
    this.props.connections.map((connection) => {
      show[connection.name] = 3;
      this.connections[connection.name] = {
        targets: []
      };
    });
    this.setState({ show });
    this.rerender();
  }

  componentDidUpdate(newProps) {
    if (this.props !== newProps) {
      this.formatTypes();
      this.rerender();
    }
  }

  handleResize() {
    const element = this.rootElement;
    if (element)
      this.setState({ width: element.offsetWidth, height: element.offsetHeight });
  }

  showMore(category) {
    const { show } = this.state;
    show[category] += 5;
    this.setState({ show });
    this.rerender();
  }

  handleQuickSearch(event) {
    const value = event.target.value;
    this.handleSearchChange(value);
  }

  getPeople(connection) {
    const { name, color, connections } = connection;
    const { show, searchText } = this.state;
    const peopleToShow = (show[name]) ? show[name] : 3;

    let i = 0;
    return connections.map((child, index) => {
      const { id } = child;
      if (searchText &&
        child.title.toLowerCase().indexOf(searchText) === -1 &&
        child.occupation.toLowerCase().indexOf(searchText) === -1 &&
        name.toLowerCase().indexOf(searchText) === -1
      ) return;
      if (peopleToShow <= i) return;
      i++;
      if (!this.connections[name]) this.connections[name] = { targets: [] };
      return (
        <Person key={id} color={color} {...child} profile compact>
          <div className={s.connectionAnchor} id={id} ref={(el) => this.connections[name].targets[index] = el} />
        </Person>
      )
    });
  }

  getTitles() {
    const { connections } = this.props;
    return connections.map((connection, index) => {
      const { name, color } = connection;

      return (
        <h3 key={index} className={s.title} onClick={this.handleSearchChange.bind(this, name)}>
          {name}
          <div className={cx(s.connectionAnchor, s.connectionAnchor__source)}
               ref={(el) => {
                 this.connections[name].source = el;
                 this.connections[name].color = color;
               }} />
        </h3>
      )
    });
  }

  getConnections() {
    const { connections } = this.props;

    return connections.map((connection, index) => {
      const { name, color } = connection;
      const rawPeople = this.getPeople(connection);
      const people = [];
      for (let i of rawPeople)
        i && people.push(i); // copy each non-empty value to the 'temp' array

      const viewMoreButton = (people.length === connection.connections.length) ? false : (
        <button className={s.group__button} onClick={this.showMore.bind(this, name)}>
          <svg viewBox="0 0 24 9">
            <line x1="1" y1="1" x2="12.25" y2="8" stroke={color} />
            <line x1="11.75" y1="8" x2="23" y2="1" stroke={color} />
          </svg>
        </button>);

      return (
        <div key={index} className={s.group}>
          {people}
          {viewMoreButton}
        </div>
      )
    });
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
    this.rerender();
  }

  getResetButton() {
    const { searchText } = this.state;
    if (searchText)
      return (
        <button onClick={this.handleSearchChange.bind(this, '')}>Reset</button>
      )
  }

  rerender() {
    setTimeout(() => {
      this.setState({ rerender: !this.state.rerender })
    }, 10);
  }

  render() {
    const { person } = this.props;
    const { width, height, rerender } = this.state;
    const titles = this.getTitles();
    const connections = this.getConnections();
    const resetButton = this.getResetButton();

    const rootBB = (this.rootElement) ? this.rootElement.getBoundingClientRect() : false;

    return (
      <div className={s.container}>
        {rerender}
        <SearchBar onChange={this.handleSearchChange} />
        <div className={s.wrap} ref={(el) => {this.rootElement = el}}>
          <ConnectionWires width={width} height={height} root={rootBB} connections={this.connections} />
          <div className={s.leftGroup}>
            <Person className={s.person} {...person} profile />
            <div className={s.title_group}>
              {titles}
              {resetButton}
            </div>
          </div>
          <div className={s.connections}>
            {connections}
          </div>
        </div>
      </div>
    )
  }
}