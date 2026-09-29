import type { Route } from "./+types/matches";
import { getMatches } from "../services/match-service";

export async function clientLoader(){
    const matches = await getMatches();
    return matches;
}

export default function MatchList({ loaderData }: Route.ComponentProps){

    const matches = loaderData;
    return(
        <main>
            <h2>Available Matches:</h2>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                        <strong>{match.homeTeam} vs {match.awayTeam}</strong><br/>
                        <span>Date: {match.matchDate}</span><br/>
                        <span>Status: {match.gameStatus}</span>
                    </li>
                ))}
            </ul>
        </main>
    )
}