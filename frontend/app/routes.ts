import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/sports-index.tsx"),
    route("matches", "routes/matches.tsx"),
    route("match/:id", "routes/match.tsx"),
    route("team/:id", "routes/team.tsx"),
    route("sport/:id", "routes/sports.tsx"),
    route("competition/:id", "routes/competitions.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("profile", "routes/profile.tsx"),
    route("history", "routes/history.tsx"),
    route("admin", "routes/admin.tsx"),
  ]),
] satisfies RouteConfig;
