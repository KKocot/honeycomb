import { test, expect } from "@playwright/test";

test.describe("Honeycomb Svelte Astro Demo", () => {
  test("page loads with header", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("Honeycomb")).toBeVisible();
    await expect(page.getByText("Svelte + Astro")).toBeVisible();
  });

  test("shows API Tracker tab by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("API Tracker")).toBeVisible();
  });

  test("renders all tab buttons", async ({ page }) => {
    await page.goto("/");
    const tab_labels = [
      "API Tracker",
      "Hooks",
      "Avatar",
      "User Card",
      "Balance Card",
      "Manabar",
      "Post Card",
      "Post List",
      "Renderer",
    ];
    for (const label of tab_labels) {
      await expect(page.getByRole("tab", { name: label })).toBeVisible();
    }
  });

  test("switches tabs on click", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Avatar" }).click();
    await expect(page.getByText("Sizes")).toBeVisible();
  });

  test("provider connects to Hive blockchain", async ({ page }) => {
    await page.goto("/?tab=hooks");
    await expect(
      page.locator("[data-testid='hive-hook-status']"),
    ).toHaveText(/connected/i, { timeout: 15000 });
  });

  test("shows footer", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(
        "Honeycomb Svelte Astro Demo - @hiveio/honeycomb-svelte",
      ),
    ).toBeVisible();
  });
});
