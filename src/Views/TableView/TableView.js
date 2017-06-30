import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import strings from '../../strings.json';
import s from './TableView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

import getMutualConnections from '../../functions/getMutualConnections';

export default class TableView extends Component {

  constructor() {
    super();

    this.state = {
      show: 10,
      width: 400,
      selected: [],
      mutualConnections: 0,
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

  componentWillReceiveProps(newprops) {
    if (newprops !== this.props) {
      this.handleResize();
    }
  }

  handleResize() {
    this.setState({ width: this.tableHead.offsetWidth })
  }

  getRows() {
    const { show, searchText } = this.state;
    const { people, allPeople } = this.props;
    let i = 0;
    let lPeople = people;
    if (searchText.length) lPeople = allPeople;
    if (lPeople)
      return lPeople.map((person) => {
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

    const mutualConnections = getMutualConnections(selected, this.props);
    this.setState({ selected, mutualConnections: mutualConnections.length });
  }

  increaseShownPeople() {
    this.setState({ show: this.state.show + 10 });
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
  }

  render() {
    const { show, width, selected, mutualConnections } = this.state;
    const { people } = this.props;
    const text = (selected.length === 1) ? strings.oneMorePerson : (
      <div><span className={s.compareButton__number}>{mutualConnections}</span> {strings.mutualConnections}</div>);
    let compareButton;
    if (selected.length && (selected.length > 1 && mutualConnections > 0)) {
      compareButton = (
        <Link to={`/compare/${selected.join(',')}`} className={s.compareButton}>{text}</Link>
      )
    } else if (selected.length) {
      compareButton = (
        <div className={s.compareButton}>{text}</div>
      )
    }

    // console.log(width);
    const rows = this.getRows();
    const showMoreButton = (show < people.length && show === rows.filter(n => n).length) ? (
      <button className={s.showMore} onClick={this.increaseShownPeople}>{strings.seeMorePeople}</button>
    ) : false;
    return (
      <div className={s.container}>
        <SearchBar onChange={this.handleSearchChange} />
        <div className={s.table}>
          <div ref={(el) => {
            this.tableHead = el
          }} className={s.row} style={{ display: 'block' }}>
            <div className={s.head} style={{ width: '9em' }}>{strings.compare}</div>
            <div className={s.head} style={{ width: (width > 1088) ? '20.5em' : '27em' }}>{strings.basicInformation}</div>
            <div className={cx(s.head, { [s.hidden]: width < 1088 })} style={{ width: '27.5em' }}>Ocupación</div>
            <div className={cx(s.head, { [s.hidden]: width < 456 })} style={{ width: '8em' }}>Total conexiones</div>
            <div className={cx(s.head, { [s.hidden]: width < 688 })} />
          </div>

          <div className={s.body}>
            {rows}
            {compareButton}
            {showMoreButton}
          </div>
        </div>
      </div>
    )
  }
}