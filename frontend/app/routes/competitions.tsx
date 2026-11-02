import type { Route } from "./+types/competitions";
import { getById } from "../services/competition-service";

export async function clientLoader({ params }: Route.ClientLoaderArgs){
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) throw new Response("Invalid competition id", { status: 400 });
    return getById(id);
}

export default function CompetitionPage({ loaderData: competition }: Route.ComponentProps){
    return(
        <main className="container py-4">
            <h1>{competition.name}</h1>
            <p>{competition.country} · {competition.sport.name}</p>
            <h2 className="h4 mt-4">Partidos</h2>
            {competition.matches.length === 0 ? <p>No hay partidos disponibles.</p> : (
                <ul className="list-group">
                    {competition.matches.map(match => (
                        <li className="list-group-item" key={match.id}>
                            <strong>{match.homeTeam} vs {match.awayTeam}</strong>
                            <div>{new Date(match.matchDate).toLocaleString("es-ES")}</div>
                            <small>{match.gameStatus}</small>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}
