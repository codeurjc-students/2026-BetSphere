import { Alert, Button, Form } from "react-bootstrap";
import { Form as RouterForm, Link, redirect, useActionData } from "react-router";
import type { Route } from "./+types/register";
import { AuthServiceError, register } from "../services/auth-service";
import { validateRegistration } from "../services/auth-validation";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const values = {
    username: String(formData.get("username") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    birthDate: String(formData.get("birthDate") ?? ""),
  };
  const errors = validateRegistration(values);
  if (Object.keys(errors).length) return { errors };

  try {
    await register(values);
    return redirect("/login?registered=1");
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

export default function RegisterPage() {
  const actionData = useActionData<typeof clientAction>();
  const errors =
    actionData && "errors" in actionData ? (actionData.errors ?? {}) : {};

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <span className="brand-mark">B</span>
        <div className="eyebrow mb-2">Start your journey</div>
        <h1 className="h2 fw-bold">Create your account</h1>
        <p className="muted mb-4">Join a community that lives for sports.</p>
        <RouterForm method="post" noValidate>
          {errors.form && <Alert variant="danger">{errors.form}</Alert>}
          <Form.Group className="mb-3" controlId="username">
            <Form.Label className="fw-semibold">
              Username
            </Form.Label>
            <Form.Control
              name="username"
              autoComplete="username"
              placeholder="Your username"
              isInvalid={Boolean(errors.username)}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Form.Group>
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
            <Form.Control
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              isInvalid={Boolean(errors.password)}
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            <Form.Text className="muted">
              8–64 characters, with uppercase, lowercase, number, and symbol.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="birthDate">
            <Form.Label className="fw-semibold">Birth date</Form.Label>
            <Form.Control
              name="birthDate"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              isInvalid={Boolean(errors.birthDate)}
            />
            <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
          </Form.Group>
          <Button className="btn-brand w-100" type="submit">
            Create account
          </Button>
        </RouterForm>
        <p className="text-center muted small mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-link">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
