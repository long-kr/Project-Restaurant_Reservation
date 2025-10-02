import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button } from '../ui';

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

const navItem = [
  { to: '/', icon: 'oi-dashboard', label: 'Dashboard' },
  { to: '/search', icon: 'oi-magnifying-glass', label: 'Search' },
  { to: '/reservations/new', icon: 'oi-plus', label: 'New Reservation' },
  { to: '/tables/new', icon: 'oi-layers', label: 'New Table' },
];

const MenuItem = ({ to, icon, label }) => {
  const className =
    label === 'Dashboard'
      ? 'list-group-item list-group-item-action border-0 bg-transparent py-4 px-0 ripple'
      : 'list-group-item list-group-item-action border-right-0 border-left-0 bg-transparent py-4 px-0 ripple';

  return (
    <li>
      <Link
        className={clsx(
          className,
          'd-flex flex-row align-items-center justify-content-lg-start justify-content-center'
        )}
        to={to}
      >
        <span className={`oi ${icon} mr-2`}></span>
        <div style={{ color: 'bisque' }}>{label}</div>
      </Link>
    </li>
  );
};

function Menu() {
  return (
    <div id="sidebarMenu" className="collapse d-lg-block sidebar col-sm">
      <nav className="position-sticky">
        <div className="list-group list-group-flush mx-3 mt-4">
          <Link
            to="/"
            className="list-group-item list-group-item-action bg-transparent px-0 py-3 ripple"
          >
            <h5 className="sidebar-brand-text text-center h4">Menu</h5>
          </Link>

          <hr className="sidebar-divider my-0" />

          <ul className="nav navbar-nav" id="accordionSidebar">
            {navItem.map(item => (
              <MenuItem
                key={item.label}
                to={item.to}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </ul>

          <div className="text-center d-none d-md-inline">
            <Button
              className="rounded-circle border-0"
              variant="link"
              id="sidebarToggle"
              type="button"
            />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
