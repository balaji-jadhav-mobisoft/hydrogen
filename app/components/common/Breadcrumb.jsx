

import {Link} from '@remix-run/react';
import './breadcrumb.css';

export default function Breadcrumb({items}) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index < items.length - 1 ? (
              <Link to={item.path}>{item.title}</Link>
            ) : (
              <span>{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
