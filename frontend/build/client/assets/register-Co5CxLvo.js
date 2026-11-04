import { o as register, t as AuthServiceError } from "./auth-service-DK-smBZq.js";
import { n as validateRegistration } from "./auth-validation-DEFlAlXk.js";
import { Form, Link, UNSAFE_withComponentProps, redirect, useActionData } from "react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Alert, Button, Form as Form$1 } from "react-bootstrap";
//#region app/routes/register.tsx
async function clientAction({ request }) {
	const formData = await request.formData();
	const values = {
		username: String(formData.get("username") ?? "").trim(),
		email: String(formData.get("email") ?? "").trim(),
		password: String(formData.get("password") ?? ""),
		birthDate: String(formData.get("birthDate") ?? "")
	};
	const errors = validateRegistration(values);
	if (Object.keys(errors).length) return { errors };
	try {
		await register(values);
		return redirect("/login?registered=1");
	} catch (error) {
		return { errors: { form: error instanceof AuthServiceError ? error.message : "Could not connect to the server. Please try again." } };
	}
}
var register_default = UNSAFE_withComponentProps(function RegisterPage() {
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
					children: "Empieza tu experiencia"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "h2 fw-bold",
					children: "Crea tu cuenta"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "muted mb-4",
					children: "Únete a una comunidad que vive el deporte."
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
							controlId: "username",
							children: [
								/* @__PURE__ */ jsx(Form$1.Label, {
									className: "fw-semibold",
									children: "Nombre"
								}),
								/* @__PURE__ */ jsx(Form$1.Control, {
									name: "username",
									autoComplete: "username",
									placeholder: "Tu nombre de usuario",
									isInvalid: Boolean(errors.username)
								}),
								/* @__PURE__ */ jsx(Form$1.Control.Feedback, {
									type: "invalid",
									children: errors.username
								})
							]
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
									autoComplete: "new-password",
									placeholder: "Crea una contraseña",
									isInvalid: Boolean(errors.password)
								}),
								/* @__PURE__ */ jsx(Form$1.Control.Feedback, {
									type: "invalid",
									children: errors.password
								}),
								/* @__PURE__ */ jsx(Form$1.Text, {
									className: "muted",
									children: "8–64 caracteres, con mayúscula, minúscula, número y símbolo."
								})
							]
						}),
						/* @__PURE__ */ jsxs(Form$1.Group, {
							className: "mb-3",
							controlId: "birthDate",
							children: [
								/* @__PURE__ */ jsx(Form$1.Label, {
									className: "fw-semibold",
									children: "Fecha de nacimiento"
								}),
								/* @__PURE__ */ jsx(Form$1.Control, {
									name: "birthDate",
									type: "date",
									max: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									isInvalid: Boolean(errors.birthDate)
								}),
								/* @__PURE__ */ jsx(Form$1.Control.Feedback, {
									type: "invalid",
									children: errors.birthDate
								})
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							className: "btn-brand w-100",
							type: "submit",
							children: "Crear cuenta"
						})
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-center muted small mt-4 mb-0",
					children: [
						"¿Ya tienes cuenta?",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: "/login",
							className: "text-link",
							children: "Inicia sesión"
						})
					]
				})
			]
		})
	});
});
//#endregion
export { clientAction, register_default as default };
