import { getCompetitions, addCompetition, updateCompetition, deleteCompetition, createTeam, removeTeam, uploadCompetitionImage } from "./competition-service";
import { getTeam, updateTeam, deleteTeam, uploadTeamImage } from "./team-service";
import { addSport, updateSport, deleteSport, uploadSportImage } from "./sport-service";
import { addMatch, updateMatch, deleteMatch } from "./match-service";

export type AdminEntity = "users" | "sports" | "competitions" | "teams" | "matches";
type AdminActionResult = { ok: true; entity: AdminEntity; intent: string } | { ok: false; entity: AdminEntity; intent: string; error: string };

/** Runs the CRUD operation requested by the admin form submitted to the route action. */
export async function performAdminAction(request: Request): Promise<AdminActionResult> {
  const data = await request.formData();
  const entity = String(data.get("entity")) as AdminEntity;
  const intent = String(data.get("intent") ?? "create");
  const id = Number(data.get("id"));
  const value = (name: string) => String(data.get(name) ?? "");
  const image = data.get("image");

  if (!["users", "sports", "competitions", "teams", "matches"].includes(entity)) {
    return { ok: false, entity: "sports", intent, error: "Tipo de registro no válido." };
  }

  try {
    if (intent === "delete") {
      if (entity === "sports") await deleteSport(id);
      else if (entity === "competitions") await deleteCompetition(id);
      else if (entity === "teams") {
        const competitions = await getCompetitions();
        const linked = competitions.filter((competition) => competition.teams.some((team) => team.id === id));
        for (const competition of linked) await removeTeam(competition.id, id);
        await deleteTeam(id);
      } else if (entity === "matches") await deleteMatch(id);
      else throw new Error("No se puede borrar este registro.");
      return { ok: true, entity, intent };
    }

    if (entity === "sports") {
      const saved = intent === "edit" ? await updateSport(id, { name: value("name") }) : await addSport({ name: value("name") });
      if (image instanceof File && image.size > 0) await uploadSportImage(saved.id, image);
    } else if (entity === "competitions") {
      const payload = { name: value("name"), country: value("country"), sportId: Number(value("sportId")) };
      const saved = intent === "edit" ? await updateCompetition(id, payload) : await addCompetition(payload);
      if (image instanceof File && image.size > 0) await uploadCompetitionImage(saved.id, image);
    } else if (entity === "teams") {
      const existing = intent === "edit" ? await getTeam(id) : null;
      const payload = { name: value("name"), country: value("country"), logoUrl: existing?.logoUrl ?? null };
      const saved = intent === "edit" ? await updateTeam(id, payload) : await createTeam(Number(value("competitionId")), payload);
      if (image instanceof File && image.size > 0) await uploadTeamImage(saved.id, image);
    } else if (entity === "matches") {
      const homeTeamId = Number(value("homeTeamId"));
      const awayTeamId = Number(value("awayTeamId"));
      const [homeTeam, awayTeam] = await Promise.all([getTeam(homeTeamId), getTeam(awayTeamId)]);
      const payload = { homeTeam: homeTeam.name, awayTeam: awayTeam.name, matchDate: value("matchDate"), homeOdds: value("homeOdds") ? Number(value("homeOdds")) : null, drawOdds: value("drawOdds") ? Number(value("drawOdds")) : null, awayOdds: value("awayOdds") ? Number(value("awayOdds")) : null, gameStatus: value("gameStatus"), homeTeamId, awayTeamId, competitionId: Number(value("competitionId")) };
      if (intent === "edit") await updateMatch(id, payload); else await addMatch(payload);
    }
    return { ok: true, entity, intent };
  } catch (error) {
    return { ok: false, entity, intent, error: error instanceof Error ? error.message : "No se pudo completar la acción." };
  }
}
