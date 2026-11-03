import { Link } from "react-router";
export default function RegisterPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <span className="brand-mark">B</span>
        <div className="eyebrow mb-2">Empieza tu experiencia</div>
        <h1 className="h2 fw-bold">Crea tu cuenta</h1>
        <p className="muted mb-4">Únete a una comunidad que vive el deporte.</p>
        <form>
          <label className="form-label fw-semibold" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            className="form-control mb-3"
            placeholder="Tu nombre"
          />
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
            placeholder="Crea una contraseña"
          />
          <label className="form-check mb-3">
            <input className="form-check-input" type="checkbox" />
            <span className="form-check-label small">
              Confirmo que soy mayor de 18 años
            </span>
          </label>
          <button className="btn btn-brand w-100" type="button">
            Crear cuenta
          </button>
        </form>
        <p className="text-center muted small mt-4 mb-0">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-link">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
