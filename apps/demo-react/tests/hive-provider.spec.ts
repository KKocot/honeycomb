import { test, expect } from "@playwright/test";

test.describe("HiveProvider", () => {
  test("page loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Honeycomb React Demo");
  });

  test("shows connection status section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Connection Status")).toBeVisible();
  });

  test("connects to Hive blockchain", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize")).toHaveText("connected", { timeout: 15000 });
  });

  test("displays current endpoint after connection", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize")).toHaveText("connected", { timeout: 15000 });
    // Endpoint URL should be visible (font-mono paragraph)
    await expect(page.locator("p.font-mono").first()).not.toHaveText("Not connected");
  });

  test("shows all endpoints section with count", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize")).toHaveText("connected", { timeout: 15000 });
    await expect(page.getByText(/All Endpoints \([1-9]\d*\)/)).toBeVisible();
  });

  test("shows green status indicator when connected", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize")).toHaveText("connected", { timeout: 15000 });
    await expect(page.locator(".bg-green-500").first()).toBeVisible();
  });

  test("endpoint list shows health indicators", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize")).toHaveText("connected", { timeout: 15000 });
    // At least one endpoint URL should be visible
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });
});
