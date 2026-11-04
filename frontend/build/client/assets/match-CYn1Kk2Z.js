import { t as getMatchById } from "./match-service-C8YlnZtP.js";
import { t as optionalUser } from "./auth-guards-C9Aq42OB.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
//#region app/routes/match.tsx
async function clientLoader({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) throw new Response("Invalid match id", { status: 400 });
	const [match, user] = await Promise.all([getMatchById(id), optionalUser()]);
	return {
		match,
		user
	};
}
function formatDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-ES");
}
function TeamStats({ name, team }) {
	return /* @__PURE__ */ jsx(Card, {
		className: "stats-card h-100",
		children: /* @__PURE__ */ jsxs(Card.Body, { children: [
			/* @__PURE__ */ jsx("h3", {
				className: "h5 fw-bold",
				children: name
			}),
			/* @__PURE__ */ jsx("p", {
				className: "muted small",
				children: team.country
			}),
			/* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("dl", {
				className: "row mb-0",
				children: [
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Partidos"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.totalMatches
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Victorias"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.wins
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Empates"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.draws
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Derrotas"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.losses
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Goles a favor"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.goalsFor
					}),
					/* @__PURE__ */ jsx("dt", {
						className: "col-8",
						children: "Goles en contra"
					}),
					/* @__PURE__ */ jsx("dd", {
						className: "col-4",
						children: team.goalsAgainst
					})
				]
			}) })
		] })
	});
}
var match_default = UNSAFE_withComponentProps(function MatchPage({ loaderData }) {
	const { match, user } = loaderData;
	const loginHref = `/login?returnTo=${encodeURIComponent(`/match/${match.id}`)}`;
	const odds = [
		{
			label: "1",
			name: match.homeTeam.name,
			value: match.homeOdds
		},
		{
			label: "X",
			name: "Empate",
			value: match.drawOdds
		},
		{
			label: "2",
			name: match.awayTeam.name,
			value: match.awayOdds
		}
	];
	return /* @__PURE__ */ jsxs(Container, {
		as: "main",
		className: "py-5 page-enter",
		children: [
			/* @__PURE__ */ jsx(Link, {
				className: "back-link",
				to: "/matches",
				children: "← Todos los partidos"
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "match-hero my-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "eyebrow",
						children: [
							match.competition.name,
							" · ",
							match.competition.sport.name
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "match-header-meta mt-3",
						children: [/* @__PURE__ */ jsx("span", { children: formatDate(match.matchDate) }), /* @__PURE__ */ jsx(Badge, {
							bg: "dark",
							className: "status-badge",
							children: match.gameStatus
						})]
					}),
					/* @__PURE__ */ jsxs(Row, {
						className: "align-items-center text-center mt-4 gy-3",
						children: [
							/* @__PURE__ */ jsx(Col, {
								xs: 5,
								children: /* @__PURE__ */ jsx("h1", {
									className: "match-team-title",
									children: match.homeTeam.name
								})
							}),
							/* @__PURE__ */ jsx(Col, {
								xs: 2,
								children: /* @__PURE__ */ jsx("strong", {
									className: "match-score-display",
									"aria-label": "Score unavailable",
									children: "—:—"
								})
							}),
							/* @__PURE__ */ jsx(Col, {
								xs: 5,
								children: /* @__PURE__ */ jsx("h1", {
									className: "match-team-title",
									children: match.awayTeam.name
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs(Row, {
				className: "g-4",
				children: [/* @__PURE__ */ jsxs(Col, {
					lg: 8,
					children: [
						/* @__PURE__ */ jsxs("section", {
							className: "surface-card mb-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "section-heading mt-0",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "eyebrow mb-2",
									children: "Mercado principal"
								}), /* @__PURE__ */ jsx("h2", {
									className: "section-title mb-0",
									children: "Resultado · 1X2"
								})] }), /* @__PURE__ */ jsx("span", {
									className: "muted small",
									children: "Solo visual · no disponible"
								})]
							}), /* @__PURE__ */ jsx(Row, {
								className: "g-2",
								children: odds.map((odd) => /* @__PURE__ */ jsx(Col, {
									xs: 4,
									children: /* @__PURE__ */ jsxs(Button, {
										className: "match-odd-button w-100",
										disabled: true,
										"aria-label": `Odds ${odd.label} disabled`,
										children: [/* @__PURE__ */ jsxs("span", {
											className: "small muted",
											children: [
												odd.label,
												" · ",
												odd.name
											]
										}), /* @__PURE__ */ jsx("span", {
											className: "fs-4 fw-bold",
											children: odd.value == null ? "—" : odd.value.toFixed(2)
										})]
									})
								}, odd.label))
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "section-heading mt-0",
							children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "eyebrow mb-2",
								children: "Forma de temporada"
							}), /* @__PURE__ */ jsx("h2", {
								className: "section-title mb-0",
								children: "Estadísticas de los equipos"
							})] })
						}),
						/* @__PURE__ */ jsxs(Row, {
							className: "g-3",
							children: [/* @__PURE__ */ jsx(Col, {
								md: 6,
								children: /* @__PURE__ */ jsx(TeamStats, {
									name: match.homeTeam.name,
									team: match.homeTeam
								})
							}), /* @__PURE__ */ jsx(Col, {
								md: 6,
								children: /* @__PURE__ */ jsx(TeamStats, {
									name: match.awayTeam.name,
									team: match.awayTeam
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsxs(Col, {
					lg: 4,
					children: [/* @__PURE__ */ jsx(Card, {
						className: "stats-card mb-3",
						children: /* @__PURE__ */ jsxs(Card.Body, { children: [
							/* @__PURE__ */ jsx("div", {
								className: "eyebrow mb-2",
								children: "Comunidad"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "h5 fw-bold",
								children: "Chat en directo"
							}),
							user ? /* @__PURE__ */ jsx("p", {
								className: "muted mb-0",
								children: "La conversación del partido estará disponible próximamente."
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
								className: "muted",
								children: "Inicia sesión para participar en el chat."
							}), /* @__PURE__ */ jsx(Link, {
								className: "btn btn-outline-dark w-100",
								to: loginHref,
								children: "Iniciar sesión"
							})] })
						] })
					}), /* @__PURE__ */ jsx(Card, {
						className: "stats-card",
						children: /* @__PURE__ */ jsxs(Card.Body, { children: [
							/* @__PURE__ */ jsx("div", {
								className: "eyebrow mb-2",
								children: "Tu siguiente paso"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "h5 fw-bold",
								children: "Acciones del partido"
							}),
							user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
								className: "btn-brand w-100 mb-2",
								disabled: true,
								children: "Iniciar apuesta · Próximamente"
							}), /* @__PURE__ */ jsx(Button, {
								className: "btn-outline-light w-100",
								disabled: true,
								children: "Generar predicción con IA · Próximamente"
							})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("p", {
								className: "muted",
								children: "Inicia sesión para apostar o generar un resumen con IA."
							}), /* @__PURE__ */ jsx(Link, {
								className: "btn btn-brand w-100",
								to: loginHref,
								children: "Iniciar sesión"
							})] })
						] })
					})]
				})]
			})
		]
	});
});
//#endregion
export { clientLoader, match_default as default };
