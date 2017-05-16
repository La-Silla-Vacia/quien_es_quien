import { h, render } from 'preact';
import cx from 'classnames';
import s from './Searchbar.css';

import strings from '../../strings.json';

const Searchbar = ({ children, ...props }) => (
  <div className={cx(s.container, { [s.noLabel]: props.labelHidden })}>
    <input type="text" className={s.input} placeholder={strings.searchText} />
    <svg className={s.icon} viewBox="0 0 24 24">
      <circle className={s.icon__circle} cx="9" cy="9" r="8.5" />
      <line className={s.icon__line} x1="15" y1="15" x2="23.5" y2="23.5"/>
    </svg>
  </div>
);

export default Searchbar;