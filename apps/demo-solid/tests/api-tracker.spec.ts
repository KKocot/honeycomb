import { test, expect } from "@playwright/test";

test.describe("ApiTracker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize").first()).toHaveText(
      "connected",
      { timeout: 15000 }
    );
  });

  test("renders API Tracker section", async ({ page }) => {
    await expect(page.getByText("API Tracker")).toBeVisible();
  });

  test("shows pill badge with status", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await expect(pill).toBeVisible();
    await expect(pill.locator("span.capitalize")).toHaveText("connected");
  });

  test("shows green status dot when connected", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await expect(pill.locator(".bg-green-500")).toBeAttached();
  });

  test("opens tooltip on click", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip).toBeVisible();
    await expect(tooltip.getByText("API Endpoints")).toBeVisible();
  });

  test("tooltip shows healthy count", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip.locator("text=/\\d+\\/\\d+ healthy/")).toBeVisible();
  });

  test("tooltip shows endpoint list with health badges", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip.locator(".font-mono").first()).toBeVisible();
    await expect(tooltip.getByText("Healthy").first()).toBeVisible();
  });

  test("tooltip shows refresh button", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip.getByText("Refresh")).toBeVisible();
  });

  test("refresh button triggers health check", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    const refresh_btn = tooltip.getByText("Refresh");
    await refresh_btn.click();

    await expect(tooltip.getByText("Checking...")).toBeVisible({ timeout: 5000 });
    await expect(tooltip.getByText("Refresh")).toBeVisible({ timeout: 15000 });
  });

  test("tooltip shows last check timestamps", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip.getByText(/Last check:/).first()).toBeVisible();
  });

  test("closes tooltip on outside click", async ({ page }) => {
    const pill = page.locator("button.rounded-full");
    await pill.click();

    const tooltip = page.locator("[data-expanded]");
    await expect(tooltip).toBeVisible();

    await page.locator("h1").click();
    await expect(tooltip).not.toBeVisible();
  });
});
