import { afterEach, describe, expect, it, vi } from "vitest";
import { validateRegistration } from "../../app/services/auth-validation";

afterEach(() => vi.useRealTimers());

describe("validateRegistration", () => {
  it("accepts the applicant on their 18th birthday and rejects them the day before", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 10, 12));
    const details = {
      username: "test_user",
      email: "user@example.test",
      password: "ValidPass1!",
    };

    expect(validateRegistration({ ...details, birthDate: "2008-11-10" })).toEqual({});
    expect(validateRegistration({ ...details, birthDate: "2008-11-11" })).toEqual({
      birthDate: "You must be at least 18 years old to register.",
    });
  });
});
