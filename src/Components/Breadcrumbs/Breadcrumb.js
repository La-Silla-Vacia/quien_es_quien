import React from 'react';
import { Link } from 'react-router-dom';
import s from './Breadcrumbs.css';

const Breadcrumb = ({ children, ...props }) => (
  <li className={s.item}>
    <Link to={props.href}>
      { children }
    </Link>
  </li>
);

export default Breadcrumb;