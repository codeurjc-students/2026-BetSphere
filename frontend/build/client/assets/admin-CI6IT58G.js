import { n as requireAdmin } from "./auth-guards-C9Aq42OB.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/admin.tsx
function clientLoader(args) {
	return requireAdmin(args);
}
var admin_default = UNSAFE_withComponentProps(function AdminPage() {
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "eyebrow",
				children: "Gestión de plataforma"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Panel de administración"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "muted",
				children: "Vista de demostración para herramientas de gestión."
			}),
			/* @__PURE__ */ jsx("div", {
				className: "row g-3 mt-3",
				children: [
					[
						"Usuarios",
						"1.284",
						"Gestionar usuarios"
					],
					[
						"Deportes",
						"8",
						"Gestionar deportes"
					],
					[
						"Competiciones",
						"32",
						"Gestionar competiciones"
					],
					[
						"Partidos",
						"146",
						"Gestionar partidos"
					]
				].map(([title, count, action]) => /* @__PURE__ */ jsx("div", {
					className: "col-sm-6 col-xl-3",
					children: /* @__PURE__ */ jsxs("div", {
						className: "stat-card",
						children: [
							/* @__PURE__ */ jsx("span", { children: title }),
							/* @__PURE__ */ jsx("strong", { children: count }),
							/* @__PURE__ */ jsxs("button", {
								className: "btn btn-outline-dark w-100 mt-3",
								disabled: true,
								children: [action, " · Próximamente"]
							})
						]
					})
				}, title))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "surface-card mt-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "d-flex justify-content-between align-items-center",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "h5 fw-bold mb-0",
							children: "Usuarios recientes"
						}), /* @__PURE__ */ jsx("button", {
							className: "btn btn-brand",
							disabled: true,
							children: "Nuevo usuario"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "table-responsive mt-3",
						children: /* @__PURE__ */ jsxs("table", {
							className: "table",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", { children: "Usuario" }),
								/* @__PURE__ */ jsx("th", { children: "Correo" }),
								/* @__PURE__ */ jsx("th", { children: "Estado" }),
								/* @__PURE__ */ jsx("th", { children: "Acción" })
							] }) }), /* @__PURE__ */ jsx("tbody", { children: [
								[
									"Lucía Romero",
									"lucia@example.com",
									"Activo"
								],
								[
									"Álvaro Martín",
									"alvaro@example.com",
									"Activo"
								],
								[
									"Sofía Torres",
									"sofia@example.com",
									"Revisión"
								]
							].map((row) => /* @__PURE__ */ jsx("tr", { children: row.map((cell, i) => /* @__PURE__ */ jsx("td", { children: cell }, i)) }, row[1])) })]
						})
					}),
					/* @__PURE__ */ jsx("p", {
						className: "small muted mb-0",
						children: "Contenido de ejemplo · Las acciones de administración no están conectadas."
					})
				]
			})
		]
	});
});
//#endregion
export { clientLoader, admin_default as default };
