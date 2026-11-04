import { r as requireUser } from "./auth-guards-C9Aq42OB.js";
import { Link, UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/profile.tsx
function clientLoader(args) {
	return requireUser(args);
}
var profile_default = UNSAFE_withComponentProps(function ProfilePage() {
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "eyebrow",
				children: "Tu espacio"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Mi perfil"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row g-3 mt-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ jsxs("section", {
						className: "surface-card",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "team-avatar mb-3",
								children: "C"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "h4 fw-bold",
								children: "Carlos Martínez"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "muted",
								children: "carlos@example.com"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "badge text-bg-success",
								children: "Cuenta verificada"
							}),
							/* @__PURE__ */ jsx("hr", {}),
							/* @__PURE__ */ jsx(Link, {
								className: "text-link",
								to: "/history",
								children: "Ver historial →"
							})
						]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "col-lg-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "row g-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "col-sm-6",
							children: /* @__PURE__ */ jsxs("div", {
								className: "stat-card",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Saldo disponible" }),
									/* @__PURE__ */ jsx("strong", { children: "125,50 €" }),
									/* @__PURE__ */ jsx("button", {
										className: "btn btn-brand mt-3",
										disabled: true,
										children: "Añadir fondos · Próximamente"
									})
								]
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "col-sm-6",
							children: /* @__PURE__ */ jsxs("div", {
								className: "stat-card",
								children: [
									/* @__PURE__ */ jsx("span", { children: "Actividad este mes" }),
									/* @__PURE__ */ jsx("strong", { children: "12 partidos" }),
									/* @__PURE__ */ jsx("span", {
										className: "mt-2",
										children: "Datos de demostración"
									})
								]
							})
						})]
					}), /* @__PURE__ */ jsxs("section", {
						className: "surface-card mt-3",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "h5 fw-bold",
							children: "Datos personales"
						}), /* @__PURE__ */ jsx("p", {
							className: "muted mb-0",
							children: "La edición del perfil estará disponible próximamente."
						})]
					})]
				})]
			})
		]
	});
});
//#endregion
export { clientLoader, profile_default as default };
