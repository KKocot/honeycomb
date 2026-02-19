import { test, expect } from "@playwright/test";

test.describe("HiveProvider", () => {
  test("page loads with title", async ({ page }) => {
    await page.goto("/demo/react-next");
    await expect(page).toHaveTitle("Honeycomb React Demo");
  });

  test("default tab is API Tracker", async ({ page }) => {
    await page.goto("/demo/react-next");
    await expect(
      page.getByRole("tab", { name: "API Tracker" })
    ).toHaveAttribute("aria-selected", "true");
  });

  test("clicking Hooks tab shows Connection Status section", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.getByText("Connection Status")).toBeVisible();
  });

  test("Hooks tab connects to Hive blockchain", async ({ page }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.locator("span.capitalize")).toHaveText("connected", {
      timeout: 15000,
    });
  });

  test("Hooks tab displays current endpoint after connection", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.locator("span.capitalize")).toHaveText("connected", {
      timeout: 15000,
    });
    await expect(page.locator("p.font-mono").first()).not.toHaveText(
      "Not connected"
    );
  });

  test("Hooks tab shows all endpoints section with count", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.locator("span.capitalize")).toHaveText("connected", {
      timeout: 15000,
    });
    await expect(
      page.getByText(/All Endpoints \([1-9]\d*\)/)
    ).toBeVisible();
  });

  test("Hooks tab shows green status indicator when connected", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.locator("span.capitalize")).toHaveText("connected", {
      timeout: 15000,
    });
    await expect(page.locator("[class*=bg-hive-success]").first()).toBeVisible();
  });

  test("Hooks tab endpoint list shows health indicators", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.locator("span.capitalize")).toHaveText("connected", {
      timeout: 15000,
    });
    await expect(page.locator("span.font-mono").first()).toBeVisible();
  });

  test("Hooks tab shows Account Lookup section", async ({ page }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.getByText("Account Lookup")).toBeVisible();
  });

  test("Hooks tab shows Chain API section", async ({ page }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.getByText("Chain API")).toBeVisible();
  });
});

test.describe("Tab navigation", () => {
  test("clicking Hooks tab shows all hook sections", async ({ page }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.getByText("Connection Status")).toBeVisible();
    await expect(page.getByText("Current Endpoint")).toBeVisible();
    await expect(page.getByText("Account Lookup")).toBeVisible();
    await expect(page.getByText("Chain API")).toBeVisible();
  });

  test("clicking API Tracker tab returns to API Tracker", async ({
    page,
  }) => {
    await page.goto("/demo/react-next");
    await page.getByRole("tab", { name: "Hooks" }).click();
    await expect(page.getByText("Connection Status")).toBeVisible();
    await page.getByRole("tab", { name: "API Tracker" }).click();
    await expect(
      page.getByRole("heading", { name: "API Tracker" }).first()
    ).toBeVisible();
  });

  test("tab has correct aria attributes", async ({ page }) => {
    await page.goto("/demo/react-next");
    const api_tracker_tab = page.getByRole("tab", { name: "API Tracker" });
    const hooks_tab = page.getByRole("tab", { name: "Hooks" });

    await expect(api_tracker_tab).toHaveAttribute("aria-selected", "true");
    await expect(hooks_tab).toHaveAttribute("aria-selected", "false");

    await hooks_tab.click();

    await expect(api_tracker_tab).toHaveAttribute("aria-selected", "false");
    await expect(hooks_tab).toHaveAttribute("aria-selected", "true");
  });
});
