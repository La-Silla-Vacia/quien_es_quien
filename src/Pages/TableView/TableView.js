import React, { Component } from 'react';
import cx from 'classnames';

import s from './TableView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

export default class TableView extends Component {

  constructor() {
    super();

    this.state = {
      show: 10,
      width: 400,
      searchText: ''
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.increaseShownPeople = this.increaseShownPeople.bind(this);
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
          <Person key={person.id} {...person} />
        )
      });
  }

  increaseShownPeople() {
    this.setState({show: this.state.show + 10});
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
  }

  render() {
    const { width } = this.state;
    // console.log(width);
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <SearchBar onChange={this.handleSearchChange} />
        <div className={s.table}>
          <div ref={(el) => {
            this.tableHead = el
          }} className={s.row}>
            <div className={s.head} style={{ width: '3.5em' }}>Comparar</div>
            <div className={s.head}>Información básica</div>
            <div className={cx(s.head, { [s.hidden]: width < 1088 })}>Ocupación</div>
            <div className={cx(s.head, { [s.hidden]: width < 456 })} style={{ width: '8em' }}>Total conexiones</div>
            <div className={cx(s.head, { [s.hidden]: width < 688 })} />
          </div>

          <div className={s.body}>
            {rows}
            <button className={s.showMore} onClick={this.increaseShownPeople}>Show more people</button>
          </div>
        </div>
      </div>
    )
  }
}