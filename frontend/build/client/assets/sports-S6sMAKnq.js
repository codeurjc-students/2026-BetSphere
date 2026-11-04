import { t as getById } from "./sport-service-BVyz0FfF.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/sports.tsx
async function clientLoader({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) throw new Response("Invalid sport id", { status: 400 });
	return getById(id);
}
var sports_default = UNSAFE_withComponentProps(function SportPage({ loaderData: sport }) {
	return /* @__PURE__ */ jsxs("main", {
		className: "container py-4",
		children: [
			/* @__PURE__ */ jsx("h1", { children: sport.name }),
			/* @__PURE__ */ jsx("h2", {
				className: "h4 mt-4",
				children: "Competiciones"
			}),
			sport.competitions.length === 0 ? /* @__PURE__ */ jsx("p", { children: "No hay competiciones disponibles." }) : /* @__PURE__ */ jsx("ul", {
				className: "list-group",
				children: sport.competitions.map((competition) => /* @__PURE__ */ jsxs("li", {
					className: "list-group-item",
					children: [/* @__PURE__ */ jsx(Link, {
						to: `/competition/${competition.id}`,
						children: competition.name
					}), competition.country && /* @__PURE__ */ jsxs("span", { children: [" · ", competition.country] })]
				}, competition.id))
			})
		]
	});
});
//#endregion
export { clientLoader, sports_default as default };
