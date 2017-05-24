import { h, render, Component } from 'preact';
import cx from 'classnames';

import strings from '../../strings.json';

import s from './PersonView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";
import Breadcrumbs from "../../Components/Breadcrumbs/Breadcrumbs";

export default class PersonView extends Component {

  constructor() {
    super();

    this.state = {
      show: [],
      width: 320,
      height: 568,
      searchText: '',
      rerender: false,
    };

    this.connections = {};

    this.handleResize = this.handleResize.bind(this);
    this.handleQuickSearch = this.handleQuickSearch.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    const { show } = this.state;
    const { connections } = this.props;

    connections.map((connection) => {
      show[connection.name] = 3;
      this.connections[connection.name] = {
        targets: []
      };
    });
    this.setState({ show });
    setTimeout(() => {
      this.setState({ rerender: !this.state.rerender })
    }, 100);
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(newProps) {
    if (this.props !== newProps) {
      this.setState({ rerender: !this.state.rerender });
    }
  }

  handleResize() {
    console.log('handleResize');
    const element = this.rootElement;
    if (!element) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    this.setState({ width, height });
  }

  showMore(category) {
    const { show } = this.state;
    show[category] += 5;
    this.setState({ show });
    setTimeout(() => {
      this.setState({ rerender: !this.state.rerender })
    }, 100);
    // this.handleResize();
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
    // this.getWires();
    return connections.map((child, index) => {
      const { id } = child;
      if (searchText) {
        if (
          child.title.toLowerCase().indexOf(searchText) === -1 &&
          child.occupation.toLowerCase().indexOf(searchText) === -1 &&
          name.toLowerCase().indexOf(searchText) === -1
        ) return;
      }

      if (peopleToShow <= i) return;

      i++;
      if (!this.connections[name]) this.connections[name] = { targets: [] };
      return (
        <Person
          key={id}
          color={color}
          {...child}
          profile
          compact
        >
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
      const { name } = connection;
      const rawPeople = this.getPeople(connection);
      const people = [];
      for (let i of rawPeople)
        i && people.push(i); // copy each non-empty value to the 'temp' array
      const viewMoreButton = (people.length === connection.connections.length) ? false : (
        <button className={s.group__button} onClick={this.showMore.bind(this, name)}>
          <svg viewBox="0 0 24 9">
            <line x1="1" y1="1" x2="12.25" y2="8" strokeWidth={1} />
            <line x1="11.75" y1="8" x2="23" y2="1" strokeWidth={1} />
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

  getWires() {
    if (!this.rootElement) return;
    const containerBB = this.rootElement.getBoundingClientRect();
    const containerTop = containerBB.top;
    const containerLeft = containerBB.left;

    const connections = this.connections;
    return Object.keys(connections).map((key) => {
      const connection = connections[key];
      const { source, targets, color } = connection;
      // console.log(targets);
      if (!source) return;
      const sourceBB = source.getBoundingClientRect();
      const halfSourceSize = source.offsetWidth / 2;
      const sourceX = (sourceBB.left + halfSourceSize) - containerLeft;
      const sourceY = (sourceBB.top + halfSourceSize) - containerTop;
      return targets.map((target) => {
        if (!target || !target.parentNode) return;
        const id = `t${target.id}`;
        const targetBB = target.getBoundingClientRect();
        const halfTargetSize = target.offsetWidth / 2;
        const targetX = (targetBB.left + halfTargetSize) - containerLeft;
        const targetY = (targetBB.top + halfTargetSize) - containerTop;

        if (targetX < 0) return;
        return (
          <line
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
            style={{ stroke: color }}
            className={s.line}
          />
        )
      });
    });
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
    setTimeout(() => {
      this.setState({ rerender: !this.state.rerender })
    }, 100);
  }

  getResetButton() {
    const { searchText } = this.state;
    if (!searchText) return;
    return (
      <button onClick={this.handleSearchChange.bind(this, '')}>Reset</button>
    )
  }

  render(props, state) {
    const { person, breadcrumbs } = props;
    const { width, height, rerender } = state;
    const titles = this.getTitles();
    const connections = this.getConnections();
    const wires = this.getWires();
    const resetButton = this.getResetButton();

    return (
      <div className={s.container}>
        {rerender}
        <SearchBar onChange={this.handleSearchChange} />
        <div
          className={s.wrap}
          ref={(el) => {
            this.rootElement = el
          }}
        >
          <svg className={s.lines} width={width} height={height}>
            {wires}
          </svg>
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