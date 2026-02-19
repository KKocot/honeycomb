import { test, expect } from "@playwright/test";

test.describe("HiveProvider", () => {
  test("page loads with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Solid Demo");
  });

  test("shows connection status section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Connection Status")).toBeVisible();
  });

  test("connects to Hive blockchain", async ({ page }) => {
    await page.goto("/");
    // Status dd should show "connected"
    const status_dd = page.locator("dt:has-text('Status') + dd");
    await expect(status_dd).toHaveText(/connected/i, { timeout: 15000 });
  });

  test("displays current endpoint after connection", async ({ page }) => {
    await page.goto("/");
    const status_dd = page.locator("dt:has-text('Status') + dd");
    await expect(status_dd).toHaveText(/connected/i, { timeout: 15000 });
    // Current Endpoint dd should not say "None"
    const endpoint_dd = page.locator("dt:has-text('Current Endpoint') + dd");
    await expect(endpoint_dd).not.toHaveText("None");
  });

  test("shows API Endpoints section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("API Endpoints")).toBeVisible();
    const status_dd = page.locator("dt:has-text('Status') + dd");
    await expect(status_dd).toHaveText(/connected/i, { timeout: 15000 });
    // At least one endpoint card should be visible
    await expect(page.locator("code.font-mono").first()).toBeVisible();
  });

  test("shows green indicator when connected", async ({ page }) => {
    await page.goto("/");
    const status_dd = page.locator("dt:has-text('Status') + dd");
    await expect(status_dd).toHaveText(/connected/i, { timeout: 15000 });
    await expect(page.locator(".bg-green-500").first()).toBeVisible();
  });

  test("shows client side detection", async ({ page }) => {
    await page.goto("/");
    const client_dd = page.locator("dt:has-text('Client Side') + dd");
    await expect(client_dd).toHaveText("Yes");
  });
});
