import { Alert, Button, Form } from "react-bootstrap";
import { Form as RouterForm, Link, redirect, useActionData } from "react-router";
import type { Route } from "./+types/login";
import { AuthServiceError, getCurrentUser, login } from "../services/auth-service";
import { validateLogin } from "../services/auth-validation";
import { restoreSession, useAuthStore } from "../stores/auth-store";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const errors = validateLogin(email, password);
  if (Object.keys(errors).length) return { errors };

  try {
    const result = await login({ email, password });
    const user = await getCurrentUser(result.accessToken!);
    useAuthStore.getState().setSession(result.accessToken!, user);
    const requestedPath = new URL(request.url).searchParams.get("returnTo");
    const destination =
      requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/";
    return redirect(destination);
  } catch (error) {
    return {
      errors: {
        form:
          error instanceof AuthServiceError
            ? error.message
            : "Could not connect to the server. Please try again.",
      },
    };
  }
}

export async function clientLoader() {
  await restoreSession();
  if (useAuthStore.getState().accessToken) return redirect("/");
  return null;
}

export default function LoginPage() {
  const actionData = useActionData<typeof clientAction>();
  const errors =
    actionData && "errors" in actionData ? (actionData.errors ?? {}) : {};

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <span className="brand-mark">B</span>
        <div className="eyebrow mb-2">Qué bueno verte</div>
        <h1 className="h2 fw-bold">Inicia sesión</h1>
        <p className="muted mb-4">Vuelve a donde vive el deporte.</p>
        <RouterForm method="post" noValidate>
          {errors.form && <Alert variant="danger">{errors.form}</Alert>}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label className="fw-semibold">
            Correo electrónico
            </Form.Label>
            <Form.Control
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              isInvalid={Boolean(errors.email)}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-semibold">
            Contraseña
            </Form.Label>
            <Form.Control
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              isInvalid={Boolean(errors.password)}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Button className="btn-brand w-100" type="submit">
            Iniciar sesión
          </Button>
        </RouterForm>
        <p className="text-center muted small mt-4 mb-0">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="text-link">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}
