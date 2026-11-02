import type { Route } from "./+types/sports-index";
import { Link } from "react-router";
import { getSports } from "../services/sport-service";

export async function clientLoader() { return getSports(); }

export default function SportsHome({ loaderData: sports }: Route.ComponentProps) {
  return <main className="container py-4"><h1>Deportes</h1><div className="list-group">
    {sports.map(sport => <Link className="list-group-item list-group-item-action" key={sport.id} to={`/sport/${sport.id}`}>{sport.name}</Link>)}
  </div></main>;
}
