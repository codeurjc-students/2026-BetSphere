import { r as requireUser } from "./auth-guards-C9Aq42OB.js";
import { UNSAFE_withComponentProps } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/routes/history.tsx
function clientLoader(args) {
	return requireUser(args);
}
var history_default = UNSAFE_withComponentProps(function HistoryPage() {
	return /* @__PURE__ */ jsxs("main", {
		className: "container-xl py-5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "eyebrow",
				children: "Tu actividad"
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Historial"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "muted",
				children: "Resumen de ingresos y resultados · Datos de demostración"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "row g-3 mt-3",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ jsx("span", { children: "Balance neto" }), /* @__PURE__ */ jsx("strong", { children: "+84,20 €" })]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "stat-card",
							children: [/* @__PURE__ */ jsx("span", { children: "Ingresos" }), /* @__PURE__ */ jsx("strong", { children: "250,00 €" })]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "stat-card",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Actividad" }),
								/* @__PURE__ */ jsx("strong", { children: "18" }),
								/* @__PURE__ */ jsx("span", { children: "apuestas de ejemplo" })
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "surface-card mt-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "d-flex justify-content-between",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "h5 fw-bold",
							children: "Balance en el tiempo"
						}), /* @__PURE__ */ jsx("span", {
							className: "badge text-bg-light",
							children: "Últimos 30 días"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "chart-placeholder mt-3",
						"aria-label": "Gráfico ilustrativo",
						children: [
							28,
							42,
							36,
							58,
							49,
							72,
							63,
							88,
							76,
							95,
							81,
							100,
							91,
							110,
							97,
							120
						].map((h, i) => /* @__PURE__ */ jsx("span", { style: { height: `${h}px` } }, i))
					}),
					/* @__PURE__ */ jsx("p", {
						className: "small muted mt-3 mb-0",
						children: "Gráfico ilustrativo; el historial real se conectará más adelante."
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "surface-card mt-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "h5 fw-bold",
					children: "Actividad reciente"
				}), /* @__PURE__ */ jsx("p", {
					className: "muted mb-0",
					children: "Todavía no hay movimientos reales que mostrar."
				})]
			})
		]
	});
});
//#endregion
export { clientLoader, history_default as default };
