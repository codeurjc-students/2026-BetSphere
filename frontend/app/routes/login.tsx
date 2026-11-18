import { Alert, Button, Form } from "react-bootstrap";
import { Form as RouterForm, Link, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
import PasswordField from "../components/PasswordField";
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
    const base = new URL(request.url);
    const target = requestedPath && /^\/(?![/\\])/.test(requestedPath) && URL.canParse(requestedPath, base)
      ? new URL(requestedPath, base)
      : null;
    const destination = target && target.origin === base.origin && !target.pathname.startsWith("//")
      ? `${target.pathname}${target.search}${target.hash}`
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
  const submitting = useNavigation().state === "submitting";
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof clientAction>();
  const errors =
    actionData && "errors" in actionData ? (actionData.errors ?? {}) : {};

  return (
    <main className="auth-wrap auth-login">
      <aside className="auth-visual">
        <p>Back in<br /><em>the stands.</em></p>
      </aside>
      <section className="auth-card">
        <h1 className="h2 fw-bold">Sign in</h1>
        <p className="muted">Open your profile and check your virtual balance.</p>
        {searchParams.get("registered") === "1" && <p role="status" className="auth-confirmation">Account created. You can sign in now.</p>}
        <RouterForm method="post" noValidate>
          {errors.form && <Alert variant="danger">{errors.form}</Alert>}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label className="fw-semibold">
              Email address
            </Form.Label>
            <Form.Control
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              isInvalid={Boolean(errors.email)}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-semibold">
              Password
            </Form.Label>
            <PasswordField autoComplete="current-password" placeholder="••••••••" error={errors.password} />
          </Form.Group>
          <Button className="btn-brand w-100" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </RouterForm>
        <p className="text-center muted small mt-4 mb-0">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-link">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
