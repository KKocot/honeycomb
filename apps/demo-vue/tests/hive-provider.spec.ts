import { test, expect } from "@playwright/test";

test.describe("HiveProvider", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize").first()).toHaveText(
      /connected|connecting/i,
      { timeout: 15000 }
    );

    const hooks_tab = page.locator('button[role="tab"]', { hasText: "Hooks" });
    await hooks_tab.click();
    await expect(hooks_tab).toHaveAttribute("aria-selected", "true");
  });

  test("page loads with title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Honeycomb Vue Demo");
  });

  test("shows connection status section", async ({ page }) => {
    await expect(page.getByText("Connection Status")).toBeVisible();
  });

  test("connects to Hive blockchain", async ({ page }) => {
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
  });

  test("displays current endpoint after connection", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Current Endpoint" })).toBeVisible();
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });

  test("shows API Endpoints section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /All Endpoints/ })).toBeVisible();
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });

  test("shows green indicator when connected", async ({ page }) => {
    const section = page.locator("section").filter({ hasText: "Connection Status" });
    await expect(section.locator(".bg-green-500").first()).toBeVisible();
  });

  test("shows healthy badge for endpoints", async ({ page }) => {
    const endpoints_section = page.locator("section").filter({ hasText: "All Endpoints" });
    await expect(endpoints_section.locator(".bg-green-500").first()).toBeVisible();
  });
});
