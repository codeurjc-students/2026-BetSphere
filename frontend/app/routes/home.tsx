import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <div className="app-shell">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
