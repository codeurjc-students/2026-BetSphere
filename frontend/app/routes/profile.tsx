import { useEffect } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/profile";
import { requireUser } from "../services/auth-guards";
import { apiFetch } from "../services/api-client";
import { useAuthStore } from "../stores/auth-store";

export function clientLoader(args: Route.ClientLoaderArgs) {
  return requireUser(args);
}

export async function clientAction(args: Route.ClientActionArgs) {
  await requireUser(args);
  const formData = await args.request.formData();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return { error: "Select an image." };
  try {
    const body = new FormData(); body.append("file", file);
    const response = await apiFetch("/api/v1/images", { method: "POST", body });
    const result = await response.json() as { url: string };
    return { avatarUrl: result.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not upload image." };
  }
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function ProfilePage({ loaderData: user }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof clientAction>();
  const setCurrentUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    if (fetcher.data && "avatarUrl" in fetcher.data) setCurrentUser({ ...user, avatarUrl: fetcher.data.avatarUrl });
  }, [fetcher.data, setCurrentUser, user]);
  const avatarUrl = fetcher.data && "avatarUrl" in fetcher.data ? fetcher.data.avatarUrl : user.avatarUrl;
  const busy = fetcher.state !== "idle";
  const initials = user.username.slice(0, 1).toLocaleUpperCase("en-US");

  return (
    <main className="container-xl arena-page account-page">
      <header className="arena-hero account-hero">
        <div className="profile-avatar" aria-label={`${user.username}'s avatar`}>
          {avatarUrl ? <img src={avatarUrl} alt={`${user.username}'s photo`} /> : initials}
        </div>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p>{user.username}{user.roles.includes("ROLE_ADMIN") && " · Administrator"}</p>
          <label className="btn btn-outline-light photo-button">
            {busy ? "Uploading…" : "Change photo"}
            <input className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy} onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const body = new FormData();
                  body.append("avatar", file);
                  fetcher.submit(body, { method: "post", encType: "multipart/form-data" });
                }
                event.target.value = "";
              }} />
          </label>
          {fetcher.data && "error" in fetcher.data && <p role="alert" className="small text-danger mt-2">{fetcher.data.error}</p>}
          {fetcher.data && "avatarUrl" in fetcher.data && <p role="status" className="small mt-2">Profile photo updated.</p>}
        </div>
      </header>
      <div className="account-grid">
        <section className="balance-panel">
          <h2>Virtual balance</h2>
          <strong>{formatBalance(user.virtualBalance)}</strong>
          <Link to="/history" className="btn btn-brand">View my history</Link>
        </section>
        <section className="account-details">
          <h2>Personal details</h2>
          <dl>
            <dt>Username</dt><dd>{user.username}</dd>
            <dt>Email address</dt><dd>{user.email}</dd>
            <dt>Birth date</dt><dd>{user.birthDate ? new Date(`${user.birthDate}T00:00:00`).toLocaleDateString("en-US") : "Not available"}</dd>
          </dl>
          {user.roles.includes("ROLE_ADMIN") && <Link to="/admin" className="btn btn-outline-light">Go to Admin Panel</Link>}
        </section>
      </div>
    </main>
  );
}
