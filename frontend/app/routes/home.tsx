import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}