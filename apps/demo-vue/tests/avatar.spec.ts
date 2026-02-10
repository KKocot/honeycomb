import { test, expect } from "@playwright/test";

test.describe("Avatar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("span.capitalize").first()).toHaveText(
      /connected/i,
      { timeout: 15000 }
    );

    const avatar_tab = page.locator('button[role="tab"]', {
      hasText: "Avatar",
    });
    await avatar_tab.click();
    await expect(avatar_tab).toHaveAttribute("aria-selected", "true");
  });

  test("renders Avatar Sizes section", async ({ page }) => {
    await expect(page.getByText("Avatar Sizes")).toBeVisible();
    await expect(
      page.getByText("Display avatars in different sizes")
    ).toBeVisible();
  });

  test("shows all 5 avatar sizes", async ({ page }) => {
    const sizes = ["xs", "sm", "md", "lg", "xl"];
    for (const size of sizes) {
      await expect(page.getByText(size).first()).toBeVisible();
    }
  });

  test("renders With Border section", async ({ page }) => {
    await expect(page.getByText("With Border")).toBeVisible();
    const section = page
      .locator("section")
      .filter({ hasText: "With Border" });
    const avatars = section.locator("img");
    await expect(avatars).toHaveCount(2);
  });

  test("renders Fallback section with initials", async ({ page }) => {
    await expect(page.getByText("Fallback")).toBeVisible();
    const fallback_section = page
      .locator("section")
      .filter({ hasText: "Fallback" });
    await expect(fallback_section.locator("div.rounded-full")).toBeVisible();
  });

  test("renders Multiple Users section", async ({ page }) => {
    await expect(page.getByText("Multiple Users")).toBeVisible();
    await expect(page.getByText("@blocktrades")).toBeVisible();
    await expect(page.getByText("@gtg")).toBeVisible();
    await expect(page.getByText("@arcange")).toBeVisible();
  });

  test("avatar images have proper alt text", async ({ page }) => {
    const avatar = page.locator('img[alt="@blocktrades"]').first();
    await expect(avatar).toBeVisible();
  });

  test("avatar images have proper src", async ({ page }) => {
    const avatar = page.locator('img[alt="@blocktrades"]').first();
    await expect(avatar).toHaveAttribute(
      "src",
      "https://images.hive.blog/u/blocktrades/avatar"
    );
  });
});
