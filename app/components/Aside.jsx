/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   heading: React.ReactNode;
 *   id?: string;
 * }}
 */

import {NavLink} from '@remix-run/react';
import CloseIcon from '~/assets/close_icon.svg';
export function Aside({children, heading, id = 'aside'}) {
  function closeAside(event) {
    if (typeof window !== 'undefined' && viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header>
          <h3>{heading}</h3>
          <CloseAside />
        </header>
        <main>{children}</main>
        <main>
          <NavLink
            className="header-menu-item nav-links login-side-menu"
            onClick={closeAside}
            prefetch="intent"
            to="/"
          >
            LOGIN
          </NavLink>
        </main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      <img src={CloseIcon} height={16} width={16} alt="" />
    </a>
  );
}
