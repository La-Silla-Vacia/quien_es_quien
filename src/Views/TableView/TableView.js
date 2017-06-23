import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import strings from '../../strings.json';
import s from './TableView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

export default class TableView extends Component {

  constructor() {
    super();

    this.state = {
      show: 10,
      width: 400,
      selected: [],
      searchText: ''
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.increaseShownPeople = this.increaseShownPeople.bind(this);
    this.handlePersonSelect = this.handlePersonSelect.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ width: this.tableHead.offsetWidth })
  }

  getRows() {
    const { show, searchText } = this.state;
    const { people } = this.props;
    let i = 0;
    if (people)
      return people.map((person) => {
        if (i > show - 1) return;
        if (searchText &&
          person.title.toLowerCase().indexOf(searchText) === -1 &&
          person.occupation.toLowerCase().indexOf(searchText) === -1
        ) return;
        i++;
        return (
          <Person onSelect={this.handlePersonSelect} key={person.id} {...person} />
        )
      });
  }

  handlePersonSelect(id, e) {
    const { selected } = this.state;
    if (e) {
      selected.push(id);
    } else {
      const index = selected.indexOf(id);
      if (index > -1) selected.splice(index, 1);
    }
    console.log(selected);
    this.setState({ selected });
  }

  increaseShownPeople() {
    this.setState({ show: this.state.show + 10 });
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
  }

  render() {
    const { width, selected } = this.state;
    const compareButton = (selected.length) ? (
      <Link to={`/compare/${selected.join(',')}`} className={s.compareButton}>{strings.compare}</Link>
    ) : false;
    // console.log(width);
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <SearchBar onChange={this.handleSearchChange} />
        <div className={s.table}>
          <div ref={(el) => {
            this.tableHead = el
          }} className={s.row} style={{ display: 'block' }}>
            <div className={s.head} style={{ width: '8em' }}>{strings.compare}</div>
            <div className={s.head} style={{ width: '24em' }}>Información básica</div>
            <div className={cx(s.head, { [s.hidden]: width < 1088 })} style={{ width: '25.5em' }}>Ocupación</div>
            <div className={cx(s.head, { [s.hidden]: width < 456 })} style={{ width: '8em' }}>Total conexiones</div>
            <div className={cx(s.head, { [s.hidden]: width < 688 })} />
          </div>

          <div className={s.body}>
            {rows}
            {compareButton}
            <button className={s.showMore} onClick={this.increaseShownPeople}>{strings.seeMorePeople}</button>
          </div>
        </div>
      </div>
    )
  }
}