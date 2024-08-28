import "../styles/NavBar.css";
import { Outlet, useLoaderData } from "react-router-dom";

function NavBar() {
  const desktopWidth = 800;
  const isDesktop = window.innerWidth > desktopWidth;
  const userData = useLoaderData();
  console.log(userData);
  if (isDesktop) {
    return (
      <>
        <FullScreenNavBar />
        <Outlet />
      </>
    );
  }
  return (
    <>
      <MobileNavBar />
      <Outlet />
    </>
  );
}

function FullScreenNavBar() {
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

function MobileNavBar() {
  return (
    <nav>
      <button>Open hamburger</button>
      <div className="username-box"></div>
      <img id="pfp"></img>
    </nav>
  );
}

export default NavBar;
