import { n as getSports } from "./sport-service-BVyz0FfF.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/sports-index.tsx
async function clientLoader() {
	return getSports();
}
var sports_index_default = UNSAFE_withComponentProps(function SportsHome({ loaderData: sports }) {
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-4 py-lg-5",
		children: [
			/* @__PURE__ */ jsx("section", {
				className: "hero-panel mb-5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "hero-copy",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "eyebrow text-success mb-3",
							children: "La emoción empieza aquí"
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "page-title hero-title",
							children: [
								/* @__PURE__ */ jsx("span", { children: "El juego se vive" }),
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "hero-accent",
									children: "en cada detalle."
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3",
							children: "Sigue tus competiciones favoritas, descubre los próximos encuentros y mantente cerca de cada partido."
						}),
						/* @__PURE__ */ jsx(Link, {
							className: "btn btn-brand mt-2",
							to: "/matches",
							children: "Explorar partidos"
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "section-heading mt-0",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Encuentra tu juego"
				}), /* @__PURE__ */ jsx("h2", {
					className: "section-title mb-0",
					children: "Deportes destacados"
				})] }), /* @__PURE__ */ jsxs("span", {
					className: "muted small",
					children: [sports.length, " deportes disponibles"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "row g-3",
				children: sports.map((sport, index) => /* @__PURE__ */ jsx("div", {
					className: "col-12 col-sm-6 col-lg-4",
					children: /* @__PURE__ */ jsxs(Link, {
						className: "sport-card",
						to: `/sport/${sport.id}`,
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "sport-icon",
								"aria-hidden": "true",
								children: [
									"⚽",
									"🏀",
									"🎾",
									"🏈",
									"🏐",
									"🏒"
								][index % 6]
							}),
							/* @__PURE__ */ jsx("h3", { children: sport.name }),
							/* @__PURE__ */ jsx("p", { children: "Competiciones, equipos y partidos" })
						]
					})
				}, sport.id))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "section-heading",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Sigue la acción"
				}), /* @__PURE__ */ jsx("h2", {
					className: "section-title mb-0",
					children: "Una mejor forma de vivir el deporte"
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row g-3 mb-5",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("article", {
							className: "surface-card h-100",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: "01 · Descubre"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "h5 fw-bold mt-3",
									children: "Todo empieza con tu deporte"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "muted mb-0",
									children: "Explora competiciones y encuentra los encuentros que te interesan."
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("article", {
							className: "surface-card h-100",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: "02 · Sigue"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "h5 fw-bold mt-3",
									children: "Cada partido, más cerca"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "muted mb-0",
									children: "Consulta horarios, equipos y cuotas desde un mismo lugar."
								})
							]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("article", {
							className: "surface-card h-100",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "eyebrow",
									children: "03 · Disfruta"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "h5 fw-bold mt-3",
									children: "El deporte es el protagonista"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "muted mb-0",
									children: "Una experiencia clara, pensada para acompañar cada jornada."
								})
							]
						})
					})
				]
			})
		]
	});
});
//#endregion
export { clientLoader, sports_index_default as default };
