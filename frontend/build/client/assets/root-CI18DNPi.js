import { t as restoreSession } from "./auth-store-BqyWjXwj.js";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, UNSAFE_withHydrateFallbackProps, isRouteErrorResponse, useRouteError } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region app/pages/GlobalErrorPage.tsx
function GlobalErrorPage() {
	const error = useRouteError();
	const detail = isRouteErrorResponse(error) && error.statusText ? error.statusText : void 0;
	return /* @__PURE__ */ jsx("main", {
		className: "error-page container-fluid px-3 px-md-4",
		role: "main",
		children: /* @__PURE__ */ jsxs("section", {
			className: "error-card row g-0",
			role: "alert",
			"aria-labelledby": "error-title",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "col-lg-7 error-copy",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "eyebrow mb-3",
						children: "Pausa técnica"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "page-title mb-3",
						id: "error-title",
						children: "No hemos podido cargar esta jugada."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "muted error-description",
						children: "Ha ocurrido un problema inesperado. Puedes volver al inicio o probar de nuevo dentro de un momento."
					}),
					detail && /* @__PURE__ */ jsx("p", {
						className: "error-detail",
						children: detail
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "d-flex flex-wrap gap-2",
						children: [/* @__PURE__ */ jsxs(Link, {
							className: "btn btn-brand",
							to: "/",
							children: ["Volver al inicio ", /* @__PURE__ */ jsx("span", {
								"aria-hidden": "true",
								children: "→"
							})]
						}), /* @__PURE__ */ jsx("button", {
							className: "btn btn-outline-light error-retry",
							type: "button",
							onClick: () => window.location.reload(),
							children: "Reintentar"
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "col-lg-5 error-art",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "error-ball error-ball--warning",
						children: "!"
					}),
					/* @__PURE__ */ jsx("span", { className: "error-orbit error-orbit--one" }),
					/* @__PURE__ */ jsx("span", { className: "error-orbit error-orbit--two" }),
					/* @__PURE__ */ jsx("span", {
						className: "error-art-caption",
						children: "REVISANDO EL TERRENO"
					})
				]
			})]
		})
	});
}
//#endregion
//#region app/pages/NotFoundPage.tsx
function NotFoundPage() {
	return /* @__PURE__ */ jsx("main", {
		className: "error-page container-fluid px-3 px-md-4",
		role: "main",
		children: /* @__PURE__ */ jsxs("section", {
			className: "error-card row g-0",
			"aria-labelledby": "error-title",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "col-lg-7 error-copy",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "eyebrow mb-3",
						children: "Fuera de juego · 404"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "page-title mb-3",
						id: "error-title",
						children: "Esta página no está en el marcador."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "muted error-description",
						children: "Puede que el enlace haya cambiado o que la dirección no exista. Vuelve al inicio y sigue explorando BetSphere."
					}),
					/* @__PURE__ */ jsxs(Link, {
						className: "btn btn-brand",
						to: "/",
						children: ["Volver al inicio ", /* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							children: "→"
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "col-lg-5 error-art",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "error-ball",
						children: "404"
					}),
					/* @__PURE__ */ jsx("span", { className: "error-orbit error-orbit--one" }),
					/* @__PURE__ */ jsx("span", { className: "error-orbit error-orbit--two" })
				]
			})]
		})
	});
}
//#endregion
//#region app/root.tsx
function Layout({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "es",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsx(Outlet, {});
});
async function clientLoader() {
	await restoreSession();
	return null;
}
var HydrateFallback = UNSAFE_withHydrateFallbackProps(function HydrateFallback() {
	return /* @__PURE__ */ jsx("main", {
		style: {
			padding: "2rem",
			textAlign: "center"
		},
		children: /* @__PURE__ */ jsx("p", {
			role: "status",
			children: "Loading BetSphere..."
		})
	});
});
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary({ error }) {
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) return /* @__PURE__ */ jsx(NotFoundPage, {});
	}
	return /* @__PURE__ */ jsx(GlobalErrorPage, {});
});
//#endregion
export { ErrorBoundary, HydrateFallback, Layout, clientLoader, root_default as default };
