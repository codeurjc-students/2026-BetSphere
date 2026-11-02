import type { CompetitionDTO } from "./CompetitionDTO";

export interface SportDTO{
    id: number,
    name: string,
    iconUrl: string | null;
    competitions: CompetitionDTO[];
}
