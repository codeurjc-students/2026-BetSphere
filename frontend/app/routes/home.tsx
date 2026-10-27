import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}