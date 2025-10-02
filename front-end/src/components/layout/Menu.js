import { Link } from 'react-router-dom';

// TODO: create NavItem
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

const MenuItem = ({ to, icon, label }) =>
  label === 'Dashboard' ? (
    <li>
      <Link
        className="list-group-item list-group-item-action border-0 bg-transparent py-4 px-0 ripple"
        to={to}
      >
        <span className={`oi ${icon}`}>&nbsp;{label}</span>
      </Link>
    </li>
  ) : (
    <li>
      <Link
        className="list-group-item list-group-item-action border-right-0 border-left-0 bg-transparent py-4 px-0 ripple"
        to={to}
      >
        <span className={`oi ${icon}`}>&nbsp;{label}</span>
      </Link>
    </li>
  );

function Menu() {
  return (
    <div
      id="sidebarMenu"
      className="collapse d-lg-block sidebar collapse col-sm"
    >
      <nav className="position-sticky">
        <div className="list-group list-group-flush mx-3 mt-4">
          <Link
            className="list-group-item list-group-item-action bg-transparent px-0 py-3 ripple"
            to="/"
          >
            <div className="sidebar-brand-text text-center">
              <h5 className="h4">Menu</h5>
            </div>
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
            <button
              className="btn rounded-circle border-0"
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
