import { test, expect } from "@playwright/test";

test.describe("HiveProvider", () => {
  test("page loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Honeycomb Vue Demo");
  });

  test("shows connection status section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Connection Status")).toBeVisible();
  });

  test("connects to Hive blockchain", async ({ page }) => {
    await page.goto("/");
    // Status text should show "connected"
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
  });

  test("displays current endpoint after connection", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
    // Endpoint should be visible in font-mono span
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });

  test("shows API Endpoints section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("API Endpoints")).toBeVisible();
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
    // At least one endpoint URL visible
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });

  test("shows green indicator when connected", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
    await expect(page.locator(".bg-green-500").first()).toBeVisible();
  });

  test("shows healthy badge for endpoints", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".capitalize")).toHaveText(/connected/i, {
      timeout: 15000,
    });
    await expect(page.getByText("Healthy").first()).toBeVisible();
  });
});
