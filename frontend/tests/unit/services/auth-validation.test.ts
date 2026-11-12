import { describe, expect, it } from "vitest";
import { validateLogin } from "../../../app/services/auth-validation";

describe("validateLogin", () => {
  it("accepts a valid email and a nonempty password", () => {
    expect(validateLogin("user@example.test", "password")).toEqual({});
  });

  it("reports an invalid email and missing password", () => {
    expect(validateLogin("invalid-email", "")).toEqual({
      email: "Enter a valid email address.",
      password: "Enter your password.",
    });
  });
});
