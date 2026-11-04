import { n as getMatches } from "./match-service-C8YlnZtP.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/matches.tsx
async function clientLoader() {
	return await getMatches();
}
var matches_default = UNSAFE_withComponentProps(function MatchList({ loaderData }) {
	const matches = loaderData;
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "eyebrow",
				children: "Calendario"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Partidos"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "muted mb-4",
				children: "Toda la acción, en un solo lugar."
			}),
			matches.length ? matches.map((match) => /* @__PURE__ */ jsxs(Link, {
				className: "match-row",
				to: `/match/${match.id}`,
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
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
				}), /* @__PURE__ */ jsx("div", {
					className: "match-meta",
					children: new Date(match.matchDate).toLocaleString("es-ES")
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "text-end",
					children: [/* @__PURE__ */ jsx("div", {
						className: "match-status",
						children: match.gameStatus
					}), /* @__PURE__ */ jsx("span", {
						className: "small muted",
						children: "Ver partido →"
					})]
				})]
			}, match.id)) : /* @__PURE__ */ jsx("div", {
				className: "surface-card muted",
				children: "No hay partidos disponibles."
			})
		]
	});
});
//#endregion
export { clientLoader, matches_default as default };
