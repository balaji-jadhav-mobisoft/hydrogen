import {Await, NavLink} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {useRootLoaderData} from '~/lib/root-data';
import './header.css';
import HeaderIcon from '~/assets/go-green.jpg';
import CartIcon from '~/assets/briefcase-blank (1).svg';
import SearchIcon from '~/assets/search.svg';
import UserIcon from '~/assets/user-icon.svg';
import DownArrow from '~/assets/down.svg';
import MenuIcon from '~/assets/menu_icon.svg';
import SearchForm from './SearchForm';
/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  const [model, setModel] = useState(false);
  const closeModel = () => setModel(false);
  useEffect(() => {
    if (model) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [model]);
  return (
    <>
      <div className="top-header" style={{backgroundColor: '#607556'}}>
        <TopHeader />
      </div>

      {model ? (
        <>
          {console.log(model, 'model')}
          <div
            className={`modal-overlay ${model ? 'open' : ''}`}
            onClick={closeModel}
          ></div>
          <div
            className={`header header-section1 ${model ? 'open' : ''}`}
            style={{
              borderBottom: '1px solid',
              borderBottomColor: '#d4d4d4',
            }}
          >
            <SearchForm setModel={setModel} />
          </div>
        </>
      ) : (
        <header
          className="header header-section"
          style={{
            borderBottom: '1px solid',
            borderBottomColor: '#d4d4d4',
            flexDirection: 'column',
          }}
        >
          <div className="header-top-sec">
            <div className="header-icon-section">
              <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
                {/* <strong>{shop.name}</strong> */}
                <div style={{maxWidth: '230px'}}>
                  <img
                    style={{height: 'auto', width: '100%'}}
                    src={HeaderIcon}
                    alt="sss"
                  />
                </div>
              </NavLink>
            </div>
            <div className="header-icon-section" style={{width: '80%'}}>
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
              />
            </div>
            <div
              style={{
                alignContent: 'center',
                width: '20%',
              }}
            >
              <HeaderCtas
                isLoggedIn={isLoggedIn}
                cart={cart}
                setModel={setModel}
              />
            </div>
          </div>
        </header>
      )}
    </>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */

export function TopHeader() {
  return (
    <>
      <div className="announcement">
        <a href="" className="announcement__link">
          <span className="announcement__text">
            Earn 10% cashback on ALL orders as a Barnraiser!
          </span>
        </a>
      </div>
    </>
  );
}

export function HeaderMenu({menu, primaryDomainUrl, viewport}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (typeof window !== 'undefined' && viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (!item.url) return null;

      const url =
        item.url.includes('myshopify.com') ||
        item.url.includes(publicStoreDomain) ||
        item.url.includes(primaryDomainUrl)
          ? new URL(item.url).pathname
          : item.url;

      return (
        <div className="menu-item" key={item.id}>
          <NavLink
            // className="header-menu-item nav-links"
            className={`header-menu-item nav-links ${
              item.items && item.items.length > 0 ? 'has-sub-items' : ''
            }`}
            end
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            <span>{item.title}</span>
            {item.items && item.items.length > 0 && (
              <span className="dropdown-arrow">
                <img
                  style={{marginBottom: '-5px', marginLeft: '7px'}}
                  src={DownArrow}
                  height={20}
                  width={20}
                  alt=""
                />
              </span>
            )}
          </NavLink>
          {item.items && item.items.length > 0 && (
            <div className="dropdown">{renderMenuItems(item.items)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        ></NavLink>
      )}
      {renderMenuItems(menu.items || FALLBACK_HEADER_MENU.items)}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart, setModel}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        className="account-sign-in-section"
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) =>
              isLoggedIn ? (
                <img src={UserIcon} height={22} width={22} />
              ) : (
                <img src={UserIcon} height={22} width={22} />
              )
            }
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle setModel={setModel} />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <img src={MenuIcon} height={20} width={20} alt="" />
    </a>
  );
}

function SearchToggle({setModel}) {
  return (
    <>
      <span>
        <img
          style={{cursor: 'pointer'}}
          src={SearchIcon}
          height={20}
          width={20}
          alt=""
          onClick={() => setModel(true)}
        />
      </span>
    </>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return (
    <a href="#cart-aside" className="cart-badge">
      <img src={CartIcon} height={20} width={20} alt="cart" />{' '}
      {count > 0 && <span className="cart-badge-count">{count}</span>}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || ''} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    // fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
