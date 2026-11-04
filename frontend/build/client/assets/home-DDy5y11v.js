import { i as logout } from "./auth-service-DK-smBZq.js";
import { n as useAuthStore } from "./auth-store-BqyWjXwj.js";
import { Link, NavLink, Outlet, UNSAFE_withComponentProps } from "react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region app/components/Header.tsx
function Header() {
	const [open, setOpen] = useState(false);
	const user = useAuthStore((state) => state.user);
	const clearSession = useAuthStore((state) => state.clearSession);
	async function handleLogout() {
		try {
			await logout();
		} finally {
			clearSession();
			setOpen(false);
		}
	}
	return /* @__PURE__ */ jsx("header", {
		className: "site-header",
		children: /* @__PURE__ */ jsxs("nav", {
			className: "navbar navbar-expand-lg container-xl py-3",
			"aria-label": "Navegación principal",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					className: "brand-lockup",
					to: "/",
					onClick: () => setOpen(false),
					children: [/* @__PURE__ */ jsx("span", {
						className: "brand-mark",
						children: "B"
					}), /* @__PURE__ */ jsxs("span", { children: [
						"BETSPHERE",
						/* @__PURE__ */ jsx("span", {
							className: "brand-period",
							children: "."
						}),
						/* @__PURE__ */ jsx("small", { children: "SPORTS · LIVE · ODDS" })
					] })]
				}),
				/* @__PURE__ */ jsx("button", {
					className: "navbar-toggler",
					type: "button",
					"aria-label": "Abrir navegación",
					"aria-expanded": open,
					onClick: () => setOpen(!open),
					children: /* @__PURE__ */ jsx("span", { className: "navbar-toggler-icon" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: `collapse navbar-collapse ${open ? "show" : ""}`,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "navbar-nav mx-auto gap-lg-2",
						children: [
							/* @__PURE__ */ jsx(NavLink, {
								className: "nav-link",
								to: "/",
								children: "Deportes"
							}),
							/* @__PURE__ */ jsx(NavLink, {
								className: "nav-link",
								to: "/matches",
								children: "Partidos"
							}),
							/* @__PURE__ */ jsx(NavLink, {
								className: "nav-link",
								to: "/history",
								children: "Historial"
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "d-flex gap-2 align-items-center py-2 py-lg-0",
						children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							className: "btn btn-link text-decoration-none fw-semibold",
							to: "/profile",
							onClick: () => setOpen(false),
							children: user.username
						}), /* @__PURE__ */ jsx("button", {
							className: "btn btn-outline-light",
							type: "button",
							onClick: handleLogout,
							children: "Cerrar sesión"
						})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							className: "btn btn-link text-decoration-none text-dark fw-semibold",
							to: "/login",
							onClick: () => setOpen(false),
							children: "Iniciar sesión"
						}), /* @__PURE__ */ jsx(Link, {
							className: "btn btn-brand",
							to: "/register",
							onClick: () => setOpen(false),
							children: "Crear cuenta"
						})] })
					})]
				})
			]
		})
	});
}
//#endregion
//#region app/components/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "site-footer mt-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container-xl py-5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "row g-4 align-items-start",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "col-md-6",
						children: [/* @__PURE__ */ jsxs(Link, {
							className: "brand-lockup text-white",
							to: "/",
							children: [/* @__PURE__ */ jsx("span", {
								className: "brand-mark",
								children: "B"
							}), /* @__PURE__ */ jsxs("span", { children: [
								"BETSPHERE",
								/* @__PURE__ */ jsx("span", {
									className: "brand-period",
									children: "."
								}),
								/* @__PURE__ */ jsx("small", { children: "SPORTS · LIVE · ODDS" })
							] })]
						}), /* @__PURE__ */ jsx("p", {
							className: "footer-copy mt-3",
							children: "Cada partido cuenta. Sigue el juego, entiende las cuotas y disfruta del deporte."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "col-6 col-md-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "footer-title",
								children: "Explorar"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								children: "Deportes"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/matches",
								children: "Partidos"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/history",
								children: "Historial"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "col-6 col-md-3",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "footer-title",
								children: "Tu cuenta"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/login",
								children: "Iniciar sesión"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/register",
								children: "Crear cuenta"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/profile",
								children: "Perfil"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "footer-bottom mt-5 pt-3",
				children: [
					"© 2026 BetSphere",
					" ",
					/* @__PURE__ */ jsx("span", { children: "Juega con responsabilidad · Solo mayores de 18 años" })
				]
			})]
		})
	});
}
//#endregion
//#region app/routes/home.tsx
var home_default = UNSAFE_withComponentProps(function Home() {
	return /* @__PURE__ */ jsxs("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("div", {
				className: "main-content",
				children: /* @__PURE__ */ jsx(Outlet, {})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
});
//#endregion
export { home_default as default };
