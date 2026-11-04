import { Link, UNSAFE_withComponentProps, useParams } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/team.tsx
var team_default = UNSAFE_withComponentProps(function TeamPage() {
	const { id } = useParams();
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5",
		children: [
			/* @__PURE__ */ jsx(Link, {
				to: "/matches",
				className: "text-link",
				children: "← Volver"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card mt-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "team-avatar",
						children: "R"
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "eyebrow",
							children: "Equipo · ficha de demostración"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "page-title h2 mb-1",
							children: "Real Madrid"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "muted mb-0",
							children: "Madrid, España"
						})
					] })]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "section-heading",
				children: /* @__PURE__ */ jsx("h2", {
					className: "section-title",
					children: "Rendimiento de temporada"
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "row g-3",
				children: [
					["Partidos", 28],
					["Victorias", 20],
					["Empates", 5],
					["Derrotas", 3],
					["Goles a favor", 61],
					["Goles en contra", 24]
				].map(([label, value]) => /* @__PURE__ */ jsx("div", {
					className: "col-6 col-md-4 col-lg-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [/* @__PURE__ */ jsx("strong", { children: value }), /* @__PURE__ */ jsx("span", { children: label })]
					})
				}, label))
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "small muted mt-3",
				children: ["Vista de ejemplo · ID ", id]
			})
		]
	});
});
//#endregion
export { team_default as default };
