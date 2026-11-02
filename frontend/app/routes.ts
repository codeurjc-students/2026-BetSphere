import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/matches.tsx"),
    route("sport/:id", "routes/sports.tsx"),
    route("competition/:id", "routes/competitions.tsx"),
  ]),
] satisfies RouteConfig;
