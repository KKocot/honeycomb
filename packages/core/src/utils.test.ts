import { describe, it, expect, vi, afterEach } from "vitest";
import {
  format_reputation,
  fetch_bridge_reputation,
  calculate_manabar,
  format_mana_number,
  format_cooldown,
} from "./utils";

describe("format_reputation", () => {
  // Known raw -> expected mappings verified against peakd.com / bridge.get_profile
  // Formula: floor((log10_string(abs) - 9) * 9 + 25) for raw values
  // Floor(value) for already-converted floats from bridge API

  it("converts known raw reputation values correctly", () => {
    // From Hive tutorial: raw 26714311062 -> 37
    expect(format_reputation("26714311062")).toBe(37);
    expect(format_reputation(26714311062)).toBe(37);
  });

  it("handles large raw reputation values", () => {
    // Typical high-rep accounts
    expect(format_reputation("1000000000000")).toBe(52);
    expect(format_reputation("95820568128603")).toBe(69);
    expect(format_reputation("543628137826")).toBe(49);
  });

  it("handles already-converted float from bridge.get_profile", () => {
    // bridge.get_profile returns float like 79.75
    expect(format_reputation(79.75)).toBe(79);
    expect(format_reputation("79.75")).toBe(79);
    expect(format_reputation(75.91)).toBe(75);
    expect(format_reputation(83.01)).toBe(83);
    expect(format_reputation(83.64)).toBe(83);
    expect(format_reputation(74.35)).toBe(74);
  });

  it("returns 25 for zero reputation (new account)", () => {
    expect(format_reputation(0)).toBe(25);
    expect(format_reputation("0")).toBe(25);
  });

  it("returns 25 for NaN/invalid input", () => {
    expect(format_reputation(NaN)).toBe(25);
    expect(format_reputation("")).toBe(25);
    expect(format_reputation("abc")).toBe(25);
    expect(format_reputation("null")).toBe(25);
    expect(format_reputation("undefined")).toBe(25);
    expect(format_reputation("NaN")).toBe(25);
  });

  it("handles negative raw reputation", () => {
    // Small negative raw: log10(1000) = 3, max(3-9, 0) = 0, so result = 25
    expect(format_reputation("-1000")).toBe(25);

    // Larger negative raw where log10 > 9 produces sub-25 result
    // log10_string adds epsilon, so floor((-1.00000001) * 9 + 25) = 15
    expect(format_reputation("-10000000000")).toBe(15);
  });

  it("handles negative already-converted values", () => {
    // Math.floor rounds toward negative infinity: floor(-5.5) = -6
    expect(format_reputation("-5.5")).toBe(-6);
    expect(format_reputation("-10.3")).toBe(-11);
  });

  it("handles small positive raw values (below threshold)", () => {
    // Very small raw values that are still raw (not converted)
    expect(format_reputation("1000000000")).toBe(25);
    expect(format_reputation("10000000000")).toBe(34);
  });

  it("matches condenser formula for boundary values", () => {
    // At 10^9 (log10 = 9), reputation = floor((9 - 9) * 9 + 25) = 25
    expect(format_reputation("1000000000")).toBe(25);

    // At 10^10 (log10 = 10), reputation = floor((10 - 9) * 9 + 25) = 34
    expect(format_reputation("10000000000")).toBe(34);

    // At 10^11 (log10 = 11), reputation = floor((11 - 9) * 9 + 25) = 43
    expect(format_reputation("100000000000")).toBe(43);
  });
});

describe("fetch_bridge_reputation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns floored reputation on successful bridge response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ result: { reputation: 79.75 } }),
        { status: 200 },
      ),
    );

    const result = await fetch_bridge_reputation(
      "barddev",
      "https://api.hive.blog",
    );
    expect(result).toBe(79);
  });

  it("returns 25 on HTTP error (500)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Internal Server Error", { status: 500 }),
    );

    const result = await fetch_bridge_reputation(
      "barddev",
      "https://api.hive.blog",
    );
    expect(result).toBe(25);
  });

  it("returns 25 when response lacks reputation field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ result: { name: "barddev" } }),
        { status: 200 },
      ),
    );

    const result = await fetch_bridge_reputation(
      "barddev",
      "https://api.hive.blog",
    );
    expect(result).toBe(25);
  });

  it("returns 25 for empty username without calling fetch", async () => {
    const fetch_spy = vi.spyOn(globalThis, "fetch");

    const result = await fetch_bridge_reputation(
      "  ",
      "https://api.hive.blog",
    );
    expect(result).toBe(25);
    expect(fetch_spy).not.toHaveBeenCalled();
  });

  it("propagates network error from fetch", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Network failure"),
    );

    await expect(
      fetch_bridge_reputation("barddev", "https://api.hive.blog"),
    ).rejects.toThrow("Network failure");
  });

  it("sends trimmed username in request body", async () => {
    const fetch_spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ result: { reputation: 50.0 } }),
        { status: 200 },
      ),
    );

    await fetch_bridge_reputation("  barddev  ", "https://api.hive.blog");

    const raw_body = fetch_spy.mock.calls[0][1]?.body;
    if (typeof raw_body !== "string") throw new Error("Expected string body");
    const call_body: unknown = JSON.parse(raw_body);
    if (
      typeof call_body !== "object" ||
      call_body === null ||
      !("params" in call_body)
    )
      throw new Error("Unexpected body shape");
    const params = call_body.params;
    if (
      typeof params !== "object" ||
      params === null ||
      !("account" in params)
    )
      throw new Error("Unexpected params shape");
    expect(params.account).toBe("barddev");
  });
});

describe("calculate_manabar", () => {
  it("calculates percentage correctly for half-full mana", () => {
    const now = Math.floor(Date.now() / 1000);
    const result = calculate_manabar("500000000", "1000000000", now);
    expect(result.percentage).toBeCloseTo(50, 0);
    expect(result.current).toBe("500000000");
    expect(result.max).toBe("1000000000");
    expect(result.cooldown).toBeGreaterThan(0);
  });

  it("calculates 100% when current equals max", () => {
    const now = Math.floor(Date.now() / 1000);
    const result = calculate_manabar("1000000000", "1000000000", now);
    expect(result.percentage).toBe(100);
    expect(result.cooldown).toBe(0);
  });

  it("caps percentage at 100 when regenerated exceeds max", () => {
    const now = Math.floor(Date.now() / 1000);
    const long_ago = now - 999999;
    const result = calculate_manabar("500000000", "1000000000", long_ago);
    expect(result.percentage).toBe(100);
    expect(result.current).toBe("1000000000");
    expect(result.cooldown).toBe(0);
  });

  it("returns 0% when max is zero", () => {
    const now = Math.floor(Date.now() / 1000);
    const result = calculate_manabar("0", "0", now);
    expect(result.percentage).toBe(0);
    expect(result.cooldown).toBe(0);
  });

  it("handles negative elapsed (client clock behind server)", () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const result = calculate_manabar("500000000", "1000000000", future);
    expect(result.percentage).toBeCloseTo(50, 0);
    expect(result.current).toBe("500000000");
  });

  it("handles large BigInt mana values", () => {
    const now = Math.floor(Date.now() / 1000);
    const result = calculate_manabar(
      "999999999999999",
      "1000000000000000",
      now,
    );
    expect(result.percentage).toBeCloseTo(100, 0);
  });
});

describe("format_mana_number", () => {
  it("formats trillions", () => {
    expect(format_mana_number("1500000000000")).toBe("1.5T");
  });

  it("formats billions", () => {
    expect(format_mana_number("2500000000")).toBe("2.5B");
  });

  it("formats millions", () => {
    expect(format_mana_number("3500000")).toBe("3.5M");
  });

  it("formats thousands", () => {
    expect(format_mana_number("4500")).toBe("4.5K");
  });

  it("returns raw string for small numbers", () => {
    expect(format_mana_number("999")).toBe("999");
    expect(format_mana_number("0")).toBe("0");
  });
});

describe("format_cooldown", () => {
  it("returns 'Full' for zero or negative seconds", () => {
    expect(format_cooldown(0)).toBe("Full");
    expect(format_cooldown(-10)).toBe("Full");
  });

  it("formats days and hours", () => {
    expect(format_cooldown(90000)).toBe("1d 1h");
  });

  it("formats hours and minutes", () => {
    expect(format_cooldown(3660)).toBe("1h 1m");
  });

  it("formats minutes only", () => {
    expect(format_cooldown(300)).toBe("5m");
  });

  it("handles exactly 24 hours (should show hours format)", () => {
    expect(format_cooldown(86400)).toBe("24h 0m");
  });
});
