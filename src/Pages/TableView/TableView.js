import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './TableView.css';
import Person from "../../Components/Person/Person";

export default class TableView extends Component {

  constructor() {
    super();

    this.state = {
      show: 50,
      width: 400
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ width: this.tableHead.offsetWidth })
  }

  getRows() {
    const { show } = this.state;
    const { people } = this.props;
    return people.map((person, index) => {
      if (index > show - 1) return;

      return (
        <Person {...person} />
      )
    });
  }

  render(props, state) {
    const { width } = state;
    const rows = this.getRows();
    return (
      <div className={s.container}>
        <div ref={(el) => {this.tableHead = el}} className={s.row}>
          <div className={s.head}>Comparar</div>
          <div className={s.head}>Información básica</div>
          <div className={cx(s.head, { [s.hidden]: width < 1088 })}>Ocupación</div>
          <div className={s.head}>Total conexiones</div>
          <div className={s.head} />
        </div>

        {/*<div className={s.wrap}>*/}
          <div className={s.body} style={{width}}>
            {rows}
          </div>
        {/*</div>*/}

      </div>
    )
  }
}