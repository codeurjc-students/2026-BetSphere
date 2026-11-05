import type { Route } from "./+types/sports";
import { Link } from "react-router";
import { getById } from "../services/sport-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0)
    throw new Response("Invalid sport id", { status: 400 });
  return getById(id);
}

export default function SportPage({ loaderData: sport }: Route.ComponentProps) {
  return (
    <main className="container py-4">
      <h1>{sport.name}</h1>
      {sport.iconUrl && <img className="entity-logo mb-3" src={sport.iconUrl} alt={`Logo de ${sport.name}`} />}
      <h2 className="h4 mt-4">Competiciones</h2>
      {sport.competitions.length === 0 ? (
        <p>No hay competiciones disponibles.</p>
      ) : (
        <ul className="list-group">
          {sport.competitions.map((competition) => (
            <li className="list-group-item" key={competition.id}>
              <Link to={`/competition/${competition.id}`}>
                {competition.iconUrl && <img className="entity-logo me-2" src={competition.iconUrl} alt="" />}
                {competition.name}
              </Link>
              {competition.country && <span> · {competition.country}</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
