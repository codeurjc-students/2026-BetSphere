import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/admin";
import { requireAdmin } from "../services/auth-guards";
import { getSportsPage, addSport, updateSport, deleteSport, uploadSportImage } from "../services/sport-service";
import { getCompetitionsPage, addCompetition, updateCompetition, deleteCompetition, createTeam, removeTeam, uploadCompetitionImage } from "../services/competition-service";
import { getMatchesPage, addMatch, updateMatch, deleteMatch } from "../services/match-service";
import { getTeamsPage, updateTeam, deleteTeam, uploadTeamImage } from "../services/team-service";
import type { SportDTO } from "../dtos/SportDTO";
import type { CompetitionDTO } from "../dtos/CompetitionDTO";
import type { TeamDTO } from "../dtos/TeamDTO";
import type { MatchDTO } from "../dtos/MatchDTO";
import type { UserDTO } from "../dtos/UserDTO";
import { getUsersPage } from "../services/user-service";
import { formatDateTime } from "../services/format-date";
import LoadMore from "../components/LoadMore";
import type { PageDTO } from "../dtos/PageDTO";

const PAGE_SIZE = 10;

const pageLoaders = { users: getUsersPage, sports: getSportsPage, competitions: getCompetitionsPage, teams: getTeamsPage, matches: getMatchesPage };

export async function clientLoader(args: Route.ClientLoaderArgs) {
  await requireAdmin(args);
  const url = new URL(args.request.url);
  const entity = url.searchParams.get("entity") as Entity | null;
  if (!entity || !(entity in pageLoaders)) return null;
  const page = Math.max(0, Number(url.searchParams.get("page") ?? 0));
  return { entity, page: await pageLoaders[entity](page, PAGE_SIZE) };
}

type Entity = "users" | "sports" | "competitions" | "teams" | "matches";
type Item = UserDTO | SportDTO | CompetitionDTO | TeamDTO | MatchDTO;
type Field = { name: string; label: string; type?: string; options?: { value: string; label: string }[] };
const entityNames: Record<Entity, string> = { users: "Usuarios", sports: "Deportes", competitions: "Competiciones", teams: "Equipos", matches: "Partidos" };

const fieldMap: Record<Entity, Field[]> = {
  users: [],
  sports: [{ name: "name", label: "Nombre" }, { name: "image", label: "Imagen", type: "file" }],
  competitions: [{ name: "name", label: "Nombre" }, { name: "country", label: "País" }, { name: "sportId", label: "Deporte", type: "select" }, { name: "image", label: "Imagen", type: "file" }],
  teams: [{ name: "name", label: "Nombre" }, { name: "country", label: "País" }, { name: "image", label: "Imagen", type: "file" }, { name: "competitionId", label: "Competición", type: "select" }],
  matches: [
    { name: "homeTeamId", label: "Equipo local", type: "select" }, { name: "awayTeamId", label: "Equipo visitante", type: "select" },
    { name: "competitionId", label: "Competición", type: "select" }, { name: "matchDate", label: "Fecha y hora", type: "datetime-local" },
    { name: "homeOdds", label: "Cuota local", type: "number" }, { name: "drawOdds", label: "Cuota empate", type: "number" },
    { name: "awayOdds", label: "Cuota visitante", type: "number" },
    { name: "gameStatus", label: "Estado", type: "select", options: [{ value: "SCHEDULED", label: "Programado" }, { value: "LIVE", label: "En directo" }, { value: "FINISHED", label: "Finalizado" }] },
  ],
};

export default function AdminPage() {
  const [active, setActive] = useState<Entity>("sports");
  const [sports, setSports] = useState<SportDTO[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [matches, setMatches] = useState<MatchDTO[]>([]);
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const [pages, setPages] = useState<Record<Entity, { page: number; totalPages: number; totalElements: number }>>({
    users: { page: 0, totalPages: 0, totalElements: 0 }, sports: { page: 0, totalPages: 0, totalElements: 0 }, competitions: { page: 0, totalPages: 0, totalElements: 0 }, teams: { page: 0, totalPages: 0, totalElements: 0 }, matches: { page: 0, totalPages: 0, totalElements: 0 },
  });
  const fetcher = useFetcher<typeof clientLoader>();

  const refresh = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [userPage, sportPage, competitionPage, teamPage, matchPage] = await Promise.all([getUsersPage(), getSportsPage(), getCompetitionsPage(), getTeamsPage(), getMatchesPage()]);
      setUsers(userPage.content); setSports(sportPage.content); setCompetitions(competitionPage.content); setTeams(teamPage.content); setMatches(matchPage.content);
      setPages({ users: { page: userPage.number, totalPages: userPage.totalPages, totalElements: userPage.totalElements }, sports: { page: sportPage.number, totalPages: sportPage.totalPages, totalElements: sportPage.totalElements }, competitions: { page: competitionPage.number, totalPages: competitionPage.totalPages, totalElements: competitionPage.totalElements }, teams: { page: teamPage.number, totalPages: teamPage.totalPages, totalElements: teamPage.totalElements }, matches: { page: matchPage.number, totalPages: matchPage.totalPages, totalElements: matchPage.totalElements } });
    } catch (err) { setError(err instanceof Error ? err.message : "No se pudieron cargar los listados."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    const result = fetcher.data;
    if (!result || !("entity" in result) || !result.page) return;
    const { entity, page } = result as { entity: Entity; page: PageDTO<Item> };
    const append = <T,>(current: T[], incoming: T[]) => [...current, ...incoming];
    if (entity === "users") setUsers((current) => append(current, page.content as UserDTO[]));
    else if (entity === "sports") setSports((current) => append(current, page.content as SportDTO[]));
    else if (entity === "competitions") setCompetitions((current) => append(current, page.content as CompetitionDTO[]));
    else if (entity === "teams") setTeams((current) => append(current, page.content as TeamDTO[]));
    else setMatches((current) => append(current, page.content as MatchDTO[]));
    setPages((current) => ({ ...current, [entity]: { page: page.number, totalPages: page.totalPages, totalElements: page.totalElements } }));
  }, [fetcher.data]);

  useEffect(() => {
    if (!notice && !formError && !deleteError) return;
    const timeout = window.setTimeout(() => { setNotice(""); setFormError(""); setDeleteError(""); }, 4500);
    return () => window.clearTimeout(timeout);
  }, [notice, formError, deleteError]);

  const rows: Item[] = active === "users" ? users : active === "sports" ? sports : active === "competitions" ? competitions : active === "teams" ? teams : matches;
  const fields = active === "users" ? [] : fieldMap[active];
  const optionsFor = (field: string) => field === "sportId" ? sports.map((row) => ({ value: String(row.id), label: row.name }))
    : field === "competitionId" ? competitions.map((row) => ({ value: String(row.id), label: row.name }))
    : field === "homeTeamId" || field === "awayTeamId" ? teams.map((row) => ({ value: String(row.id), label: row.name })) : [];

  function startCreate() {
    setEditing(null);
    setFormOpen(true);
    setImageFile(null);
    setFormError("");
    const defaults: Record<string, string> = {};
    if (active === "matches") defaults.gameStatus = "SCHEDULED";
    setForm(defaults); setError(""); setNotice("");
  }

  function startEdit(item: Item) {
    setEditing(item); setFormError(""); setNotice("");
    setFormOpen(true);
    const source = item as unknown as Record<string, unknown>;
    const values: Record<string, string> = {};
    for (const field of fields) {
      if (field.name === "sportId") values.sportId = String((item as CompetitionDTO).sport.id);
      else if (field.name === "homeTeamId" || field.name === "awayTeamId" || field.name === "competitionId") values[field.name] = String(source[field.name] ?? "");
      else if (field.name === "matchDate") values.matchDate = String(source.matchDate ?? "").slice(0, 16);
      else values[field.name] = source[field.name] == null ? "" : String(source[field.name]);
    }
    setForm(values);
    setImageFile(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError(""); setNotice("");
    const id = editing ? (editing as { id: number }).id : undefined;
    try {
      if (active === "sports") {
        const data = { name: form.name, iconUrl: editing ? (editing as SportDTO).iconUrl : null };
        const saved = id ? await updateSport(id, data) : await addSport(data);
        if (imageFile) await uploadSportImage(saved.id, imageFile);
      } else if (active === "competitions") {
        const data = { name: form.name, country: form.country, sportId: Number(form.sportId), iconUrl: editing ? (editing as CompetitionDTO).iconUrl : null };
        const saved = id ? await updateCompetition(id, data) : await addCompetition(data);
        if (imageFile) await uploadCompetitionImage(saved.id, imageFile);
      } else if (active === "teams") {
        const data = { name: form.name, country: form.country, logoUrl: editing ? (editing as TeamDTO).logoUrl : null };
        const saved = id ? await updateTeam(id, data) : await createTeam(Number(form.competitionId), data);
        if (imageFile) await uploadTeamImage(saved.id, imageFile);
      } else {
        const data = { homeTeam: teams.find((team) => team.id === Number(form.homeTeamId))?.name ?? "", awayTeam: teams.find((team) => team.id === Number(form.awayTeamId))?.name ?? "", matchDate: form.matchDate, homeOdds: form.homeOdds ? Number(form.homeOdds) : null, drawOdds: form.drawOdds ? Number(form.drawOdds) : null, awayOdds: form.awayOdds ? Number(form.awayOdds) : null, gameStatus: form.gameStatus, homeTeamId: Number(form.homeTeamId), awayTeamId: Number(form.awayTeamId), competitionId: Number(form.competitionId) };
        if (id) await updateMatch(id, data); else await addMatch(data);
      }
      setEditing(null); setForm({}); setImageFile(null); setFormOpen(false); setNotice(`${entityNames[active]} ${id ? "actualizado" : "creado"}.`); await refresh();
    } catch (err) { setFormError(err instanceof Error ? err.message : "No se pudo guardar el registro."); }
  }

  async function remove(item: Item) {
    if (active === "users") return;
    const id = (item as { id: number }).id;
    setDeleteError(""); setNotice("");
    try {
      if (active === "sports") await deleteSport(id);
      else if (active === "competitions") await deleteCompetition(id);
      else if (active === "teams") {
        const linkedCompetitions = competitions.filter((competition) => competition.teams.some((team) => team.id === id));
        for (const competition of linkedCompetitions) await removeTeam(competition.id, id);
        await deleteTeam(id);
      }
      else await deleteMatch(id);
      setPendingDelete(null); setNotice(`${entityNames[active]} eliminado.`); await refresh();
      return true;
    } catch (err) { setDeleteError(err instanceof Error ? err.message : "No se pudo borrar el registro."); return false; }
  }

  function deleteBlockReason(item: Item | null) {
    if (!item || active === "users") return "";
    const id = (item as { id: number }).id;
    if (active === "sports") {
      const count = competitions.filter((competition) => competition.sport.id === id).length;
      return count ? `Este deporte tiene ${count} ${count === 1 ? "competición asociada" : "competiciones asociadas"}. Elimina primero esas competiciones.` : "";
    }
    if (active === "competitions") {
      const count = matches.filter((match) => match.competitionId === id).length;
      return count ? `Esta competición tiene ${count} ${count === 1 ? "partido asociado" : "partidos asociados"}. Elimina primero esos partidos.` : "";
    }
    if (active === "teams") {
      const count = matches.filter((match) => match.homeTeamId === id || match.awayTeamId === id).length;
      return count ? `Este equipo participa en ${count} ${count === 1 ? "partido" : "partidos"}. Elimina primero esos partidos.` : "";
    }
    return "";
  }

  function describe(item: Item) {
    if (active === "users") { const row = item as UserDTO; return [row.username, row.email]; }
    if (active === "sports") { const row = item as SportDTO; return [row.name, `${row.competitions?.length ?? 0} competiciones`]; }
    if (active === "competitions") { const row = item as CompetitionDTO; return [row.name, `${row.country} · ${row.sport.name}`]; }
    if (active === "teams") { const row = item as TeamDTO; return [row.name, row.country]; }
    const row = item as MatchDTO; return [`${row.homeTeam} vs ${row.awayTeam}`, `${formatDateTime(row.matchDate)} · ${row.gameStatus}`];
  }

  return <main className="container-xl py-5">
    <div className="eyebrow">Gestión de plataforma</div>
    <h1 className="page-title">Panel de administración</h1>
    <p className="muted">Gestiona las entidades deportivas y consulta todos sus registros.</p>

    <div className="admin-tabs d-flex flex-wrap gap-2 mt-4" role="tablist" aria-label="Entidades">
      {(Object.keys(entityNames) as Entity[]).map((entity) => <button key={entity} type="button" role="tab" aria-selected={active === entity} className={`btn ${active === entity ? "btn-brand" : "btn-outline-light"}`} onClick={() => { setActive(entity); setEditing(null); setForm({}); setFormOpen(false); setPendingDelete(null); setFormError(""); setDeleteError(""); setError(""); setNotice(""); }}>{entityNames[entity]} <span className="admin-count">{pages[entity].totalElements}</span></button>)}
    </div>

    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
    {notice && <div className="alert alert-success mt-3" role="status">{notice}</div>}

    <section className="surface-card mt-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div><h2 className="h5 fw-bold mb-1">{entityNames[active]}</h2><p className="muted small mb-0">{rows.length} de {pages[active].totalElements} registros</p></div>
        {active !== "users" && <button className="btn btn-brand" type="button" onClick={startCreate}>Nuevo registro</button>}
      </div>
      {loading ? <p className="muted mt-4 mb-0">Cargando datos…</p> : rows.length === 0 ? <p className="muted mt-4 mb-0">Todavía no hay registros.</p> : <><div className="table-responsive mt-3"><table className="table align-middle"><thead><tr><th>ID</th><th>{active === "users" ? "Usuario" : "Nombre / partido"}</th><th>{active === "users" ? "Correo" : "Detalles"}</th>{active === "users" && <th>Rol</th>}{active !== "users" && <th className="text-end">Acciones</th>}</tr></thead><tbody>{rows.map((item) => { const [name, details] = describe(item); const userRow = active === "users" ? item as UserDTO : null; return <tr key={(item as { id: number }).id}><td>{(item as { id: number }).id}</td><td className="fw-semibold">{name}</td><td className="muted">{details}</td>{userRow ? <td><span className="admin-role">{userRow.roles.join(", ") || "Sin rol"}</span></td> : <td className="text-end text-nowrap"><button type="button" className="btn btn-sm btn-outline-light me-2" onClick={() => startEdit(item)}>Editar</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPendingDelete(item)}>Borrar</button></td>}</tr>; })}</tbody></table></div>{pages[active].page + 1 < pages[active].totalPages && <LoadMore loading={fetcher.state !== "idle"} onClick={() => fetcher.load(`/admin?entity=${active}&page=${pages[active].page + 1}&size=${PAGE_SIZE}`)} />}</>}
    </section>

    {formOpen && <section className="surface-card mt-3" aria-label={`Formulario de ${entityNames[active].toLowerCase()}`}>
      <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 fw-bold mb-0">{editing ? "Editar" : "Crear"} {entityNames[active].toLowerCase()}</h2><button type="button" className="btn-close btn-close-white" aria-label="Cerrar formulario" onClick={() => { setForm({}); setEditing(null); setFormOpen(false); setFormError(""); }} /></div>
      {formError && <div className="alert alert-danger mb-3" role="alert">{formError}</div>}
      <form onSubmit={submit}><div className="row g-3">{fields.map((field) => {
        const options = field.options ?? optionsFor(field.name);
        const required = field.name !== "image" && field.name !== "homeOdds" && field.name !== "drawOdds" && field.name !== "awayOdds" && !(active === "teams" && editing && field.name === "competitionId");
        return <div className="col-md-6" key={field.name}><label className="form-label" htmlFor={`admin-${field.name}`}>{field.label}</label>{field.type === "select" ? <select id={`admin-${field.name}`} className="form-select" required={required} value={form[field.name] ?? ""} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}><option value="">Selecciona…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : field.type === "file" ? <input id={`admin-${field.name}`} className="form-control" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} /> : <input id={`admin-${field.name}`} className="form-control" type={field.type ?? "text"} required={required} step={field.type === "number" ? "any" : undefined} value={form[field.name] ?? ""} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />}</div>;
      })}</div><div className="d-flex justify-content-end gap-2 mt-4"><button type="button" className="btn btn-outline-light" onClick={() => { setForm({}); setEditing(null); setFormOpen(false); setFormError(""); }}>Cancelar</button><button type="submit" className="btn btn-brand">Guardar</button></div></form>
    </section>}
    {pendingDelete && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setPendingDelete(null); setDeleteError(""); } }}>
      <section className="admin-modal surface-card" role="dialog" aria-modal="true" aria-labelledby="admin-delete-title" aria-describedby="admin-delete-description" onKeyDown={(event) => { if (event.key === "Escape") { setPendingDelete(null); setDeleteError(""); } }}>
        <div className="admin-modal-icon" aria-hidden="true">!</div>
        <div className="eyebrow">Confirmar acción</div>
        <h2 className="h4 fw-bold mt-2" id="admin-delete-title">¿Borrar este registro?</h2>
        <p className="muted mt-2 mb-0" id="admin-delete-description">{deleteBlockReason(pendingDelete) || (active === "teams" && competitions.some((competition) => competition.teams.some((team) => team.id === (pendingDelete as { id: number }).id)) ? "El equipo se desvinculará de sus competiciones y se borrará. Esta acción no se puede deshacer." : `Se eliminará de forma permanente de ${entityNames[active].toLowerCase()}. Esta acción no se puede deshacer.`)}</p>
        {deleteError && <div className="alert alert-danger mt-3 mb-0" role="alert">{deleteError}</div>}
        <div className="d-flex justify-content-end gap-2 mt-4"><button type="button" autoFocus className="btn btn-outline-light" onClick={() => { setPendingDelete(null); setDeleteError(""); }}>Cancelar</button><button type="button" className="btn btn-danger" disabled={Boolean(deleteBlockReason(pendingDelete))} onClick={() => { setDeleteError(""); void remove(pendingDelete); }}>Borrar</button></div>
      </section>
    </div>}
  </main>;
}
