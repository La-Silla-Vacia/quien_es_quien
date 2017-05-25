import React from 'react';
import s from './Labels.css';

const Label = ({ children, ...props }) => (
  <li className={s.label}>{ children }</li>
);

export default Label;