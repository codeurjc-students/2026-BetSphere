import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/admin";
import { requireAdmin } from "../services/auth-guards";
import { getSportsPage } from "../services/sport-service";
import { getCompetitionsPage } from "../services/competition-service";
import { getMatchesPage } from "../services/match-service";
import { getTeamsPage } from "../services/team-service";
import type { SportDTO } from "../dtos/SportDTO";
import type { CompetitionDTO } from "../dtos/CompetitionDTO";
import type { TeamDTO } from "../dtos/TeamDTO";
import type { MatchDTO } from "../dtos/MatchDTO";
import type { UserDTO } from "../dtos/UserDTO";
import { getUsersPage } from "../services/user-service";
import { formatDateTime } from "../services/format-date";
import LoadMore from "../components/LoadMore";
import type { PageDTO } from "../dtos/PageDTO";
import { performAdminAction, type AdminEntity } from "../services/admin-actions";

const PAGE_SIZE = 10;

const pageLoaders = { users: getUsersPage, sports: getSportsPage, competitions: getCompetitionsPage, teams: getTeamsPage, matches: getMatchesPage };

export async function clientLoader(args: Route.ClientLoaderArgs) {
  await requireAdmin(args);
  const url = new URL(args.request.url);
  const entity = url.searchParams.get("entity") as Entity | null;
  if (!entity || !(entity in pageLoaders)) {
    const [users, sports, competitions, teams, matches] = await Promise.all([getUsersPage(), getSportsPage(), getCompetitionsPage(), getTeamsPage(), getMatchesPage()]);
    return { kind: "initial" as const, pages: { users, sports, competitions, teams, matches } };
  }
  const page = Math.max(0, Number(url.searchParams.get("page") ?? 0));
  return { kind: "page" as const, entity, page: await pageLoaders[entity](page, PAGE_SIZE) };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  await requireAdmin({ request });
  return performAdminAction(request);
}

type Entity = AdminEntity;
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

export default function AdminPage({ loaderData }: Route.ComponentProps) {
  const [active, setActive] = useState<Entity>("sports");
  const [sports, setSports] = useState<SportDTO[]>(loaderData.kind === "initial" ? loaderData.pages.sports.content : []);
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>(loaderData.kind === "initial" ? loaderData.pages.competitions.content : []);
  const [teams, setTeams] = useState<TeamDTO[]>(loaderData.kind === "initial" ? loaderData.pages.teams.content : []);
  const [matches, setMatches] = useState<MatchDTO[]>(loaderData.kind === "initial" ? loaderData.pages.matches.content : []);
  const [users, setUsers] = useState<UserDTO[]>(loaderData.kind === "initial" ? loaderData.pages.users.content : []);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const [pages, setPages] = useState<Record<Entity, { page: number; totalPages: number; totalElements: number }>>(loaderData.kind === "initial" ? {
    users: { page: loaderData.pages.users.number, totalPages: loaderData.pages.users.totalPages, totalElements: loaderData.pages.users.totalElements }, sports: { page: loaderData.pages.sports.number, totalPages: loaderData.pages.sports.totalPages, totalElements: loaderData.pages.sports.totalElements }, competitions: { page: loaderData.pages.competitions.number, totalPages: loaderData.pages.competitions.totalPages, totalElements: loaderData.pages.competitions.totalElements }, teams: { page: loaderData.pages.teams.number, totalPages: loaderData.pages.teams.totalPages, totalElements: loaderData.pages.teams.totalElements }, matches: { page: loaderData.pages.matches.number, totalPages: loaderData.pages.matches.totalPages, totalElements: loaderData.pages.matches.totalElements },
  } : {
    users: { page: 0, totalPages: 0, totalElements: 0 }, sports: { page: 0, totalPages: 0, totalElements: 0 }, competitions: { page: 0, totalPages: 0, totalElements: 0 }, teams: { page: 0, totalPages: 0, totalElements: 0 }, matches: { page: 0, totalPages: 0, totalElements: 0 },
  });
  const fetcher = useFetcher<{ ok?: boolean; intent?: string; entity?: Entity; error?: string; page?: PageDTO<Item> }>();

  useEffect(() => {
    if (loaderData.kind !== "initial") return;
    const { users: userPage, sports: sportPage, competitions: competitionPage, teams: teamPage, matches: matchPage } = loaderData.pages;
    setUsers(userPage.content); setSports(sportPage.content); setCompetitions(competitionPage.content); setTeams(teamPage.content); setMatches(matchPage.content);
    setPages({ users: { page: userPage.number, totalPages: userPage.totalPages, totalElements: userPage.totalElements }, sports: { page: sportPage.number, totalPages: sportPage.totalPages, totalElements: sportPage.totalElements }, competitions: { page: competitionPage.number, totalPages: competitionPage.totalPages, totalElements: competitionPage.totalElements }, teams: { page: teamPage.number, totalPages: teamPage.totalPages, totalElements: teamPage.totalElements }, matches: { page: matchPage.number, totalPages: matchPage.totalPages, totalElements: matchPage.totalElements } });
  }, [loaderData]);

  useEffect(() => {
    const result = fetcher.data;
    if (!result) return;
    if ("ok" in result) {
      if (!result.ok) {
        if (result.intent === "delete") setDeleteError(result.error ?? "No se pudo borrar el registro.");
        else setFormError(result.error ?? "No se pudo guardar el registro.");
        return;
      }
      setFormError(""); setDeleteError(""); setPendingDelete(null); setFormOpen(false); setEditing(null);
      setNotice(`${entityNames[result.entity ?? active]} ${result.intent === "delete" ? "eliminado" : result.intent === "edit" ? "actualizado" : "creado"}.`);
      return;
    }
    if (!("entity" in result) || !result.page) return;
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
    setFormError("");
    const defaults: Record<string, string> = {};
    if (active === "matches") defaults.gameStatus = "SCHEDULED";
    setForm(defaults); setNotice("");
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
      {(Object.keys(entityNames) as Entity[]).map((entity) => <button key={entity} type="button" role="tab" aria-selected={active === entity} className={`btn ${active === entity ? "btn-brand" : "btn-outline-light"}`} onClick={() => { setActive(entity); setEditing(null); setForm({}); setFormOpen(false); setPendingDelete(null); setFormError(""); setDeleteError(""); setNotice(""); }}>{entityNames[entity]} <span className="admin-count">{pages[entity].totalElements}</span></button>)}
    </div>

    {notice && <div className="alert alert-success mt-3" role="status">{notice}</div>}

    <section className="surface-card mt-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div><h2 className="h5 fw-bold mb-1">{entityNames[active]}</h2><p className="muted small mb-0">{rows.length} de {pages[active].totalElements} registros</p></div>
        {active !== "users" && <button className="btn btn-brand" type="button" onClick={startCreate}>Nuevo registro</button>}
      </div>
      {rows.length === 0 ? <p className="muted mt-4 mb-0">Todavía no hay registros.</p> : <><div className="table-responsive mt-3"><table className="table align-middle"><thead><tr><th>ID</th><th>{active === "users" ? "Usuario" : "Nombre / partido"}</th><th>{active === "users" ? "Correo" : "Detalles"}</th>{active === "users" && <th>Rol</th>}{active !== "users" && <th className="text-end">Acciones</th>}</tr></thead><tbody>{rows.map((item) => { const [name, details] = describe(item); const userRow = active === "users" ? item as UserDTO : null; return <tr key={(item as { id: number }).id}><td>{(item as { id: number }).id}</td><td className="fw-semibold">{name}</td><td className="muted">{details}</td>{userRow ? <td><span className="admin-role">{userRow.roles.join(", ") || "Sin rol"}</span></td> : <td className="text-end text-nowrap"><button type="button" className="btn btn-sm btn-outline-light me-2" onClick={() => startEdit(item)}>Editar</button><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setPendingDelete(item)}>Borrar</button></td>}</tr>; })}</tbody></table></div>{pages[active].page + 1 < pages[active].totalPages && <LoadMore loading={fetcher.state !== "idle"} onClick={() => fetcher.load(`/admin?entity=${active}&page=${pages[active].page + 1}&size=${PAGE_SIZE}`)} />}</>}
    </section>

    {formOpen && <section key={`${active}-${(editing as { id: number } | null)?.id ?? "new"}`} className="surface-card mt-3" aria-label={`Formulario de ${entityNames[active].toLowerCase()}`}>
      <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h5 fw-bold mb-0">{editing ? "Editar" : "Crear"} {entityNames[active].toLowerCase()}</h2><button type="button" className="btn-close btn-close-white" aria-label="Cerrar formulario" onClick={() => { setForm({}); setEditing(null); setFormOpen(false); setFormError(""); }} /></div>
      {formError && <div className="alert alert-danger mb-3" role="alert">{formError}</div>}
      <fetcher.Form method="post"><input type="hidden" name="entity" value={active} /><input type="hidden" name="intent" value={editing ? "edit" : "create"} />{editing && <input type="hidden" name="id" value={(editing as { id: number }).id} />}<div className="row g-3">{fields.map((field) => {
        const options = field.options ?? optionsFor(field.name);
        const required = field.name !== "image" && field.name !== "homeOdds" && field.name !== "drawOdds" && field.name !== "awayOdds" && !(active === "teams" && editing && field.name === "competitionId");
        return <div className="col-md-6" key={field.name}><label className="form-label" htmlFor={`admin-${field.name}`}>{field.label}</label>{field.type === "select" ? <select id={`admin-${field.name}`} name={field.name} className="form-select" required={required} defaultValue={form[field.name] ?? ""}><option value="">Selecciona…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : field.type === "file" ? <input id={`admin-${field.name}`} name="image" className="form-control" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /> : <input id={`admin-${field.name}`} name={field.name} className="form-control" type={field.type ?? "text"} required={required} step={field.type === "number" ? "any" : undefined} defaultValue={form[field.name] ?? ""} />}</div>;
      })}</div><div className="d-flex justify-content-end gap-2 mt-4"><button type="button" className="btn btn-outline-light" onClick={() => { setForm({}); setEditing(null); setFormOpen(false); setFormError(""); }}>Cancelar</button><button type="submit" className="btn btn-brand" disabled={fetcher.state !== "idle"}>{fetcher.state !== "idle" ? "Guardando…" : "Guardar"}</button></div></fetcher.Form>
    </section>}
    {pendingDelete && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setPendingDelete(null); setDeleteError(""); } }}>
      <section className="admin-modal surface-card" role="dialog" aria-modal="true" aria-labelledby="admin-delete-title" aria-describedby="admin-delete-description" onKeyDown={(event) => { if (event.key === "Escape") { setPendingDelete(null); setDeleteError(""); } }}>
        <div className="admin-modal-icon" aria-hidden="true">!</div>
        <div className="eyebrow">Confirmar acción</div>
        <h2 className="h4 fw-bold mt-2" id="admin-delete-title">¿Borrar este registro?</h2>
        <p className="muted mt-2 mb-0" id="admin-delete-description">{deleteBlockReason(pendingDelete) || (active === "teams" && competitions.some((competition) => competition.teams.some((team) => team.id === (pendingDelete as { id: number }).id)) ? "El equipo se desvinculará de sus competiciones y se borrará. Esta acción no se puede deshacer." : `Se eliminará de forma permanente de ${entityNames[active].toLowerCase()}. Esta acción no se puede deshacer.`)}</p>
        {deleteError && <div className="alert alert-danger mt-3 mb-0" role="alert">{deleteError}</div>}
        <div className="d-flex justify-content-end gap-2 mt-4"><button type="button" autoFocus className="btn btn-outline-light" onClick={() => { setPendingDelete(null); setDeleteError(""); }}>Cancelar</button><fetcher.Form method="post"><input type="hidden" name="entity" value={active} /><input type="hidden" name="intent" value="delete" /><input type="hidden" name="id" value={(pendingDelete as { id: number }).id} /><button type="submit" className="btn btn-danger" disabled={Boolean(deleteBlockReason(pendingDelete)) || fetcher.state !== "idle"}>{fetcher.state !== "idle" ? "Borrando…" : "Borrar"}</button></fetcher.Form></div>
      </section>
    </div>}
  </main>;
}
