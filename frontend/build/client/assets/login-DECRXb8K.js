import { n as getCurrentUser, r as login, t as AuthServiceError } from "./auth-service-DK-smBZq.js";
import { n as useAuthStore, t as restoreSession } from "./auth-store-BqyWjXwj.js";
import { t as validateLogin } from "./auth-validation-DEFlAlXk.js";
import { Form, Link, UNSAFE_withComponentProps, redirect, useActionData } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Alert, Button, Form as Form$1 } from "react-bootstrap";
//#region app/routes/login.tsx
async function clientAction({ request }) {
	const formData = await request.formData();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const errors = validateLogin(email, password);
	if (Object.keys(errors).length) return { errors };
	try {
		const result = await login({
			email,
			password
		});
		const user = await getCurrentUser(result.accessToken);
		useAuthStore.getState().setSession(result.accessToken, user);
		const requestedPath = new URL(request.url).searchParams.get("returnTo");
		const destination = requestedPath?.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/";
		return redirect(destination);
	} catch (error) {
		return { errors: { form: error instanceof AuthServiceError ? error.message : "Could not connect to the server. Please try again." } };
	}
}
async function clientLoader() {
	await restoreSession();
	if (useAuthStore.getState().accessToken) return redirect("/");
	return null;
}
var login_default = UNSAFE_withComponentProps(function LoginPage() {
	const actionData = useActionData();
	const errors = actionData && "errors" in actionData ? actionData.errors ?? {} : {};
	return /* @__PURE__ */ jsx("main", {
		className: "auth-wrap",
		children: /* @__PURE__ */ jsxs("section", {
			className: "auth-card",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "brand-mark",
					children: "B"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "eyebrow mb-2",
					children: "Qué bueno verte"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "h2 fw-bold",
					children: "Inicia sesión"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "muted mb-4",
					children: "Vuelve a donde vive el deporte."
				}),
				/* @__PURE__ */ jsxs(Form, {
					method: "post",
					noValidate: true,
					children: [
						errors.form && /* @__PURE__ */ jsx(Alert, {
							variant: "danger",
							children: errors.form
						}),
						/* @__PURE__ */ jsxs(Form$1.Group, {
							className: "mb-3",
							controlId: "email",
							children: [
								/* @__PURE__ */ jsx(Form$1.Label, {
									className: "fw-semibold",
									children: "Correo electrónico"
								}),
								/* @__PURE__ */ jsx(Form$1.Control, {
									name: "email",
									type: "email",
									autoComplete: "email",
									placeholder: "tu@email.com",
									isInvalid: Boolean(errors.email)
								}),
								/* @__PURE__ */ jsx(Form$1.Control.Feedback, {
									type: "invalid",
									children: errors.email
								})
							]
						}),
						/* @__PURE__ */ jsxs(Form$1.Group, {
							className: "mb-3",
							controlId: "password",
							children: [
								/* @__PURE__ */ jsx(Form$1.Label, {
									className: "fw-semibold",
									children: "Contraseña"
								}),
								/* @__PURE__ */ jsx(Form$1.Control, {
									name: "password",
									type: "password",
									autoComplete: "current-password",
									placeholder: "••••••••",
									isInvalid: Boolean(errors.password)
								}),
								/* @__PURE__ */ jsx(Form$1.Control.Feedback, {
									type: "invalid",
									children: errors.password
								})
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							className: "btn-brand w-100",
							type: "submit",
							children: "Iniciar sesión"
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-center muted small mt-4 mb-0",
					children: [
						"¿Aún no tienes cuenta?",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: "/register",
							className: "text-link",
							children: "Regístrate"
						})
					]
				})
			]
		})
	});
});
//#endregion
export { clientAction, clientLoader, login_default as default };
