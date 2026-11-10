import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="container-xl py-5">
        <div className="row g-4 align-items-start">
          <div className="col-md-6">
            <Link className="brand-lockup text-white" to="/">
              <span className="brand-mark">B</span>
              <span>
                BETSPHERE<span className="brand-period">.</span>
                <small>SPORTS · LIVE · ODDS</small>
              </span>
            </Link>
            <p className="footer-copy mt-3">
              Every match counts. Follow the game, understand the odds, and
              enjoy sports.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="footer-title">Explore</h2>
            <Link to="/">Sports</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/history">History</Link>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="footer-title">Your Account</h2>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>
        <div className="footer-bottom mt-5 pt-3">
          © 2026 BetSphere{" "}
          <span>Play responsibly · 18+ only</span>
        </div>
      </div>
    </footer>
  );
}
