import "../styles/NavBar.css";

function NavBar() {
  return (
    <nav>
      <div className="username-box"></div>
      <div className="link-list">
        <li>
          <a href="/guidelines">Policies on AI</a>
        </li>
        <li>
          <a href="/feed">Feed</a>
        </li>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/about-us">About Us</a>
        </li>
        <li>
          <a href="/">About Us</a>
        </li>
      </div>
    </nav>
  );
}

export default NavBar;
