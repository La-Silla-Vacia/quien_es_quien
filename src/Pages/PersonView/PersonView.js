import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './PersonView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

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
      this.setState({ rerender: !this.state.rerender });
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

  getWires() {
    if (!this.rootElement) return;
    const containerBB = this.rootElement.getBoundingClientRect();
    const containerTop = containerBB.top;
    const containerLeft = containerBB.left;

    const connections = this.connections;
    return Object.keys(connections).map((key) => {
      const { source, targets, color } = connections[key];
      if (!source) return;
      const sourceBB = source.getBoundingClientRect();
      const halfSourceSize = source.offsetWidth / 2;
      const sourceCoordinates = {
        x: (sourceBB.left + halfSourceSize) - containerLeft,
        y: (sourceBB.top + halfSourceSize) - containerTop
      };
      return targets.map((target) => {
        if (!target || !target.parentNode) return;
        const targetBB = target.getBoundingClientRect();
        const halfTargetSize = target.offsetWidth / 2;
        const targetCoordinates = {
          x: (targetBB.left + halfTargetSize) - containerLeft,
          y: (targetBB.top + halfTargetSize) - containerTop
        };

        if (targetCoordinates.x > 0 || targetCoordinates.y > 0)
        return (
          <line
            key={target.id}
            x1={sourceCoordinates.x}
            y1={sourceCoordinates.y}
            x2={targetCoordinates.x}
            y2={targetCoordinates.y}
            style={{ stroke: color }}
            className={s.line}
          />
        )
      });
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

  render(props, state) {
    const { person } = props;
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