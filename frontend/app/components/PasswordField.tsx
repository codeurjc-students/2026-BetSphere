import { useState } from "react";
import { Form } from "react-bootstrap";
import { passwordRules } from "../services/auth-validation";

export default function PasswordField({
  error, autoComplete, placeholder, showRequirements = false,
}: { error?: string; autoComplete: string; placeholder: string; showRequirements?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const descriptions = [error && "password-error", showRequirements && "password-rules"].filter(Boolean).join(" ");
  return (
    <>
    <div className="password-field">
      <Form.Control name="password" type={visible ? "text" : "password"} autoComplete={autoComplete}
        placeholder={placeholder} isInvalid={Boolean(error)} aria-describedby={descriptions || undefined}
        onChange={showRequirements ? (event) => setPassword(event.target.value) : undefined} />
      <button type="button" className="password-reveal" aria-controls="password"
        aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden="true">
          <path d="M2 12s3.7-6 10-6 10 6 10 6-3.7 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
          <path className="eye-slash" data-visible={visible} d="M4 3.5 20 20.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
    {error && <Form.Control.Feedback id="password-error" type="invalid">{error}</Form.Control.Feedback>}
    {showRequirements && (
      <ul id="password-rules" className="password-rules">
        {passwordRules.map(({ label, test }) => {
          const met = test(password);
          return <li key={label} data-met={met}><span aria-hidden="true">{met ? "✓" : "○"}</span>{label}<span className="visually-hidden">{met ? " met" : " required"}</span></li>;
        })}
      </ul>
    )}
    </>
  );
}
