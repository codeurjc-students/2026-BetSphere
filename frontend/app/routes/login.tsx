import { Link } from "react-router";
export default function LoginPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <span className="brand-mark">B</span>
        <div className="eyebrow mb-2">Qué bueno verte</div>
        <h1 className="h2 fw-bold">Inicia sesión</h1>
        <p className="muted mb-4">Vuelve a donde vive el deporte.</p>
        <form>
          <label className="form-label fw-semibold" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="form-control mb-3"
            placeholder="tu@email.com"
          />
          <label className="form-label fw-semibold" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="form-control mb-3"
            placeholder="••••••••"
          />
          <button className="btn btn-brand w-100" type="button">
            Iniciar sesión
          </button>
        </form>
        <p className="text-center muted small mt-4 mb-0">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="text-link">
            Regístrate
          </Link>
        </p>
        <p className="text-center small muted mt-3">
          Acceso de demostración · Próximamente conectado
        </p>
      </section>
    </main>
  );
}
