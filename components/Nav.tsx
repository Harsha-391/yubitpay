import { Icon } from "./Icon";

const links = ["Products", "Solutions", "Developers", "Company"];

export function Nav() {
  return (
    <div className="navlayer">
      <header className="nav">
        <a href="#" aria-label="Yubit Pay">
          <Icon n="logo" w={68} h={32} />
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <button key={l} className="nav-item" type="button">
              <span className="roll" data-text={l}><span>{l}</span></span>
              <Icon n="chevron-down" w={12} />
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <a href="#"><span className="roll" data-text="Login"><span>Login</span></span></a>
          <a className="btn btn-lime" href="#">
            Start building
            <Icon n="arrow-up-right-dark" w={18} />
          </a>
        </div>
      </header>
    </div>
  );
}
