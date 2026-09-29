import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/home.tsx", [
    index("routes/matches.tsx"),
  ]),
] satisfies RouteConfig;