import type { MatchDTO } from "./MatchDTO";

/** Match data accepted by create and update requests; the server manages the ID. */
export type MatchInputDTO = Omit<MatchDTO, "id">;
