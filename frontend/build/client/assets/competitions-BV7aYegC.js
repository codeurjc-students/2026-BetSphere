import { Link, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/services/competition-service.ts
var API_URL = "/api/v1/competitions";
async function getById(id) {
	const res = await fetch(`${API_URL}/${id}`);
	if (!res.ok) throw new Response("Failed to fetch the competition", {
		status: res.status,
		statusText: res.statusText
	});
	return res.json();
}
//#endregion
//#region app/routes/competitions.tsx
async function clientLoader({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) throw new Response("Invalid competition id", { status: 400 });
	return getById(id);
}
var competitions_default = UNSAFE_withComponentProps(function CompetitionPage({ loaderData: competition }) {
	const upcomingMatches = competition.matches.filter((match) => new Date(match.matchDate).getTime() >= Date.now() && match.gameStatus !== "FINISHED");
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5 page-enter",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "eyebrow",
				children: [
					competition.sport.name,
					" · ",
					competition.country
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "competition-hero mt-3",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "eyebrow mb-2",
						children: "Competición"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "page-title",
						children: competition.name
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "muted mb-0",
						children: [
							competition.teams.length,
							" equipos · ",
							competition.matches.length,
							" ",
							"partidos"
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "section-heading",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Participantes"
				}), /* @__PURE__ */ jsx("h2", {
					className: "section-title mb-0",
					children: "Equipos"
				})] })
			}),
			competition.teams.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "muted",
				children: "No hay equipos registrados."
			}) : /* @__PURE__ */ jsx("div", {
				className: "row g-3",
				children: competition.teams.map((team) => /* @__PURE__ */ jsx("div", {
					className: "col-12 col-sm-6 col-lg-4",
					children: /* @__PURE__ */ jsxs(Link, {
						className: "team-link",
						to: `/team/${team.id}`,
						children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: team.name }), /* @__PURE__ */ jsx("span", {
							className: "d-block small muted",
							children: team.country
						})] }), /* @__PURE__ */ jsx("span", {
							className: "text-link",
							"aria-hidden": "true",
							children: "Ver equipo"
						})]
					})
				}, team.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "section-heading",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Lo que viene"
				}), /* @__PURE__ */ jsx("h2", {
					className: "section-title mb-0",
					children: "Próximos partidos"
				})] })
			}),
			upcomingMatches.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "muted",
				children: "No hay próximos partidos."
			}) : upcomingMatches.map((match) => /* @__PURE__ */ jsxs(Link, {
				className: "match-row",
				to: `/match/${match.id}`,
				children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsxs("span", {
					className: "match-teams",
					children: [
						match.homeTeam,
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "muted",
							children: "vs"
						}),
						" ",
						match.awayTeam
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "match-meta d-block",
					children: new Date(match.matchDate).toLocaleString("es-ES")
				})] }), /* @__PURE__ */ jsxs("span", {
					className: "match-status",
					children: [match.gameStatus, " →"]
				})]
			}, match.id)),
			/* @__PURE__ */ jsx("div", {
				className: "section-heading",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Calendario completo"
				}), /* @__PURE__ */ jsx("h2", {
					className: "section-title mb-0",
					children: "Todos los partidos"
				})] })
			}),
			competition.matches.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "muted",
				children: "No hay partidos disponibles."
			}) : competition.matches.map((match) => /* @__PURE__ */ jsxs(Link, {
				className: "match-row",
				to: `/match/${match.id}`,
				children: [/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsxs("span", {
					className: "match-teams",
					children: [
						match.homeTeam,
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "muted",
							children: "vs"
						}),
						" ",
						match.awayTeam
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "match-meta d-block",
					children: new Date(match.matchDate).toLocaleString("es-ES")
				})] }), /* @__PURE__ */ jsxs("span", {
					className: "match-status",
					children: [match.gameStatus, " →"]
				})]
			}, match.id))
		]
	});
});
//#endregion
export { clientLoader, competitions_default as default };
