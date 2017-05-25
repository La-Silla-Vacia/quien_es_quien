import React, { Component } from 'react';
import cx from 'classnames';

import s from './TableView.css';
import Person from "../../Components/Person";
import SearchBar from "../../Components/SearchBar";

export default class TableView extends Component {

  constructor() {
    super();

    this.state = {
      show: 50,
      width: 400,
      searchText: ''
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
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
      return people.map((person, index) => {
        if (i > show - 1) return;
        if (searchText) {
          if (
            person.title.toLowerCase().indexOf(searchText) === -1 &&
            person.occupation.toLowerCase().indexOf(searchText) === -1
          ) return;
        }
        i++;
        return (
          <Person key={person.id} {...person} />
        )
      });
  }

  handleSearchChange(value) {
    this.setState({ searchText: value.toLowerCase() });
  }

  render() {
    const { width } = this.state;
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <SearchBar onChange={this.handleSearchChange} />
        <div className={s.table}>
          <div ref={(el) => {
            this.tableHead = el
          }} className={s.row}>
            <div className={s.head}>Comparar</div>
            <div className={s.head}>Información básica</div>
            <div className={cx(s.head, { [s.hidden]: width < 1088 })}>Ocupación</div>
            <div className={s.head}>Total conexiones</div>
            <div className={s.head} />
          </div>

          {/*<div className={s.wrap}>*/}
          <div className={s.body} style={{ width }}>
            {rows}
          </div>
          {/*</div>*/}
        </div>
      </div>
    )
  }
}