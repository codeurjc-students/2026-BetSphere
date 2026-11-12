// @vitest-environment node

import { afterEach, expect, it, vi } from "vitest";
import { performAdminAction } from "../../../app/services/admin-actions";

const uploadTargets = [
  { entity: "sports", createUrl: "/api/v1/sports/" },
  { entity: "competitions", createUrl: "/api/v1/competitions/" },
  { entity: "teams", createUrl: "/api/v1/competitions/3/teams" },
];

function adminForm(entity: string, image: File) {
  const body = new FormData();
  body.set("entity", entity);
  body.set("intent", "create");
  body.set("name", "Catalog entry");
  body.set("country", "Spain");
  body.set("sportId", "2");
  body.set("competitionId", "3");
  body.set("image", image);
  return new Request("http://localhost/admin", { method: "POST", body });
}

afterEach(() => vi.unstubAllGlobals());

it.each(uploadTargets)("uploads the $entity image after creating the record", async ({ entity, createUrl }) => {
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ id: 42 }, { status: 201 }))
    .mockResolvedValueOnce(Response.json({ url: "/api/v1/images/new-logo" }));
  vi.stubGlobal("fetch", fetchMock);
  const image = new File(["logo bytes"], "logo.png", { type: "image/png" });

  await expect(performAdminAction(adminForm(entity, image))).resolves.toEqual({ ok: true, entity, intent: "create" });

  expect(fetchMock.mock.calls.map(([url, init]) => [url, init?.method])).toEqual([
    [createUrl, "POST"],
    [`/api/v1/${entity}/42/image`, "POST"],
  ]);
  const body = fetchMock.mock.calls[1][1]?.body;
  expect(body).toBeInstanceOf(FormData);
  expect((body as FormData).get("file")).toMatchObject({ name: image.name, type: image.type, size: image.size });
});

it.each(uploadTargets)("keeps the saved $entity record successful when the image is rejected", async ({ entity }) => {
  vi.stubGlobal("fetch", vi.fn<typeof fetch>()
    .mockResolvedValueOnce(Response.json({ id: 42 }, { status: 201 }))
    .mockResolvedValueOnce(Response.json({ error: "Invalid image format." }, { status: 400 })));
  const image = new File(["text"], "logo.txt", { type: "text/plain" });

  await expect(performAdminAction(adminForm(entity, image))).resolves.toEqual({
    ok: true,
    entity,
    intent: "create",
    warning: "Data was saved, but the image could not be uploaded: Invalid image format.",
  });
});
