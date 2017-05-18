import { h, render } from 'preact';
import s from './Breadcrumbs.css';

const Breadcrumb = ({ children, ...props }) => (
  <li className={s.item}>
    <a href={props.href}>
      { children }
    </a>
  </li>
);

export default Breadcrumb;