import React from 'react';
import cx from 'classnames';
import s from './Checkbox.css';

const Checkbox = ({ children, ...props }) => (
  <div className={cx(s.container, 'preventClick', { [s.noLabel]: props.labelHidden })}>
    <input className={cx(s.input, 'preventClick')} id={`select-${props.id}`} type="checkbox" />
    <label className={cx(s.label, 'preventClick')} htmlFor={`select-${props.id}`}>
      <span className={s.content}>{children}</span>
    </label>
  </div>
);

export default Checkbox;