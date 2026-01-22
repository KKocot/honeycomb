import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from demo app directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Social Actions Flow Test
 *
 * Tests the complete flow with HB-Auth:
 *
 * Test 1: Fresh registration flow
 * 1. Register/Login with HB-Auth (Save Key)
 * 2. Follow -> wait for toast success -> Unfollow
 * 3. Mute -> wait for toast success -> Unmute
 *
 * Test 2: F5 refresh + Unlock flow
 * 1. Register with HB-Auth
 * 2. Press F5 (page refresh)
 * 3. Unlock Safe Storage with password
 * 4. Follow -> Unfollow -> Mute -> Unmute
 *
 * Required env vars (see .env.example):
 * - TEST_USERNAME
 * - TEST_PASSWORD
 * - TEST_POSTING_KEY
 * - TARGET_USER
 */

test.setTimeout(120000);

test.describe('Social Actions Flow with HB-Auth', () => {
  const TEST_USERNAME = process.env.TEST_USERNAME || 'guest4test1';
  const TEST_PASSWORD = process.env.TEST_PASSWORD || '';
  const TEST_POSTING_KEY = process.env.TEST_POSTING_KEY || '';
  const TARGET_USER = process.env.TARGET_USER || 'guest4test';

  test.skip(!TEST_PASSWORD || !TEST_POSTING_KEY, 'Missing TEST_PASSWORD or TEST_POSTING_KEY in .env');

  test.beforeEach(async ({ page }) => {
    // Enable console logging for debugging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[') || text.includes('Error') || text.includes('STEP')) {
        console.log('BROWSER:', text);
      }
    });

    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });

    // Clear IndexedDB before test
    await page.goto('/');
    await page.evaluate(async () => {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      localStorage.clear();
    });
  });

  test('HB-Auth -> Follow -> Unfollow -> Mute -> Unmute (full flow)', async ({ page }) => {
    // =============================================
    // STEP 1: Login with HB-Auth
    // =============================================
    console.log('STEP 1: Navigating to auth tab...');
    await page.goto('/?tab=auth');
    await page.waitForLoadState('networkidle');

    // Wait for Hive to connect (WASM loading)
    console.log('Waiting for Hive to connect...');
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return !text.includes('Connecting to Hive') && !text.includes('Loading');
    }, { timeout: 60000 });

    // Click HB-Auth button
    console.log('Clicking HB-Auth button...');
    const hbAuthButton = page.locator('button:has-text("HB-Auth")').first();
    await expect(hbAuthButton).toBeVisible({ timeout: 10000 });
    await hbAuthButton.click();

    // Wait for HB-Auth form
    await page.waitForTimeout(2000);
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return text.includes('ready') || text.includes('idle');
    }, { timeout: 30000 });

    // Fill registration form
    console.log('Filling registration form...');
    const usernameInput = page.locator('input[placeholder="your-username"]');
    await expect(usernameInput).toBeVisible({ timeout: 5000 });
    await usernameInput.fill(TEST_USERNAME);
    await usernameInput.blur();
    await page.waitForTimeout(1000);

    // Ensure Register Key mode
    const registerTab = page.locator('button:has-text("Register Key")');
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }

    // Fill password and key
    const passwordInput = page.locator('input[placeholder*="password"]').first();
    await passwordInput.fill(TEST_PASSWORD);

    const keyInput = page.locator('input[placeholder="5..."]');
    await keyInput.fill(TEST_POSTING_KEY);

    // Save key
    console.log('Saving key...');
    const saveButton = page.locator('button:has-text("Save Key")');
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();

    // Wait for login success - user appears in header
    await expect(
      page.locator(`text=@${TEST_USERNAME}`).first()
    ).toBeVisible({ timeout: 30000 });
    console.log('Login successful!');

    // =============================================
    // STEP 2: Navigate to Social Actions
    // =============================================
    console.log('STEP 2: Navigating to Social Actions...');
    const socialTab = page.locator('button:has-text("Social Actions")');
    await socialTab.click();
    await page.waitForTimeout(1000);

    // =============================================
    // STEP 3: Follow action
    // =============================================
    console.log('STEP 3: Testing Follow...');
    const followBtn = page.locator('[data-testid="follow-btn"]').first();
    const unfollowBtn = page.locator('[data-testid="unfollow-btn"]').first();

    // Check initial state and click Follow if not already following
    const isFollowDisabled = await followBtn.isDisabled();
    if (!isFollowDisabled) {
      await followBtn.click();

      // Confirm dialog
      await expect(page.locator('text=Confirm Follow')).toBeVisible({ timeout: 5000 });
      await page.locator('button:has-text("Follow")').last().click();

      // Wait for toast success message
      await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Followed!' })).toBeVisible({ timeout: 15000 });
      console.log('Follow broadcast successful');
    } else {
      console.log('Already following, skipping Follow');
    }

    // =============================================
    // STEP 4: Unfollow action (tests optimistic update fix)
    // =============================================
    console.log('STEP 4: Testing Unfollow...');

    // With the optimistic update fix, Unfollow should be enabled immediately
    await expect(unfollowBtn).toBeEnabled({ timeout: 5000 });
    await unfollowBtn.click();

    // Confirm dialog
    await expect(page.locator('text=Confirm Unfollow')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Unfollow")').last().click();

    // Wait for toast success message
    await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Unfollowed!' })).toBeVisible({ timeout: 15000 });
    console.log('Unfollow broadcast successful - optimistic update fix verified!');

    // =============================================
    // STEP 5: Mute action (tests MuteButton HBAuthPasswordDialog fix)
    // =============================================
    console.log('STEP 5: Testing Mute...');

    const muteBtn = page.locator('[data-testid="mute-btn"]').first();
    const unmuteBtn = page.locator('[data-testid="unmute-btn"]').first();

    // Mute should be enabled (user not muted initially)
    const isMuteDisabled = await muteBtn.isDisabled();
    if (!isMuteDisabled) {
      await muteBtn.click();

      // Confirm dialog should appear
      await expect(page.locator('text=Confirm Mute')).toBeVisible({ timeout: 5000 });
      await page.locator('button:has-text("Mute")').last().click();

      // Wait for toast success message
      await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Muted!' })).toBeVisible({ timeout: 15000 });
      console.log('Mute broadcast successful - HBAuthPasswordDialog fix verified!');
    } else {
      console.log('User already muted, skipping Mute test');
    }

    // =============================================
    // STEP 6: Unmute action (tests optimistic update fix for MuteButton)
    // =============================================
    console.log('STEP 6: Testing Unmute...');

    // With the optimistic update fix, Unmute should be enabled immediately
    await expect(unmuteBtn).toBeEnabled({ timeout: 5000 });
    await unmuteBtn.click();

    // Confirm dialog
    await expect(page.locator('text=Confirm Unmute')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Unmute")').last().click();

    // Wait for toast success message
    await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Unmuted!' })).toBeVisible({ timeout: 15000 });
    console.log('Unmute broadcast successful - optimistic update fix verified!');

    console.log('ALL TESTS PASSED - Full flow verified!');
  });

  test('F5 refresh -> Unlock Safe Storage -> Follow -> Unfollow -> Mute -> Unmute', async ({ page }) => {
    // =============================================
    // PHASE 1: Initial Register with HB-Auth
    // =============================================
    console.log('PHASE 1: Initial registration...');
    await page.goto('/?tab=auth');
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return !text.includes('Connecting to Hive') && !text.includes('Loading');
    }, { timeout: 60000 });

    const hbAuthButton = page.locator('button:has-text("HB-Auth")').first();
    await hbAuthButton.click();
    await page.waitForTimeout(2000);

    // Fill registration form
    await page.locator('input[placeholder="your-username"]').fill(TEST_USERNAME);
    await page.locator('input[placeholder="your-username"]').blur();
    await page.waitForTimeout(1000);

    const registerTab = page.locator('button:has-text("Register Key")');
    if (await registerTab.isVisible()) {
      await registerTab.click();
    }

    await page.locator('input[placeholder*="password"]').first().fill(TEST_PASSWORD);
    await page.locator('input[placeholder="5..."]').fill(TEST_POSTING_KEY);
    await page.locator('button:has-text("Save Key")').click();

    await expect(page.locator(`text=@${TEST_USERNAME}`).first()).toBeVisible({ timeout: 30000 });
    console.log('Initial registration successful!');

    // =============================================
    // PHASE 2: F5 Refresh (simulate browser refresh)
    // =============================================
    console.log('PHASE 2: Pressing F5 (page refresh)...');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // =============================================
    // PHASE 3: Unlock Safe Storage
    // =============================================
    console.log('PHASE 3: Unlocking Safe Storage...');
    await page.goto('/?tab=auth');
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return !text.includes('Connecting to Hive');
    }, { timeout: 60000 });

    await page.locator('button:has-text("HB-Auth")').first().click();
    await page.waitForTimeout(2000);

    await page.locator('input[placeholder="your-username"]').fill(TEST_USERNAME);
    await page.locator('input[placeholder="your-username"]').blur();
    await page.waitForTimeout(2000);

    // Should show Unlock mode (keys already registered in IndexedDB)
    const unlockTab = page.locator('button:has-text("Unlock")').first();
    if (await unlockTab.isVisible()) {
      await unlockTab.click();
    }

    await page.locator('input[placeholder*="password"]').first().fill(TEST_PASSWORD);
    await page.locator('button').filter({ hasText: /^Unlock$/ }).last().click();

    await expect(page.locator(`text=@${TEST_USERNAME}`).first()).toBeVisible({ timeout: 30000 });
    console.log('Unlock successful!');

    // =============================================
    // PHASE 4: Navigate to Social Actions
    // =============================================
    console.log('PHASE 4: Navigating to Social Actions...');
    await page.locator('button:has-text("Social Actions")').click();
    await page.waitForTimeout(1000);

    // =============================================
    // PHASE 5: Follow action (after unlock)
    // =============================================
    console.log('PHASE 5: Testing Follow after unlock...');
    const followBtn = page.locator('[data-testid="follow-btn"]').first();
    const unfollowBtn = page.locator('[data-testid="unfollow-btn"]').first();

    const isFollowDisabled = await followBtn.isDisabled();
    if (!isFollowDisabled) {
      await followBtn.click();
      await expect(page.locator('text=Confirm Follow')).toBeVisible({ timeout: 5000 });
      await page.locator('button:has-text("Follow")').last().click();
      await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Followed!' })).toBeVisible({ timeout: 15000 });
      console.log('Follow after unlock successful!');
    } else {
      console.log('Already following, skipping Follow');
    }

    // =============================================
    // PHASE 6: Unfollow action (after unlock)
    // =============================================
    console.log('PHASE 6: Testing Unfollow after unlock...');
    await expect(unfollowBtn).toBeEnabled({ timeout: 5000 });
    await unfollowBtn.click();
    await expect(page.locator('text=Confirm Unfollow')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Unfollow")').last().click();
    await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Unfollowed!' })).toBeVisible({ timeout: 15000 });
    console.log('Unfollow after unlock successful!');

    // =============================================
    // PHASE 7: Mute action (after unlock)
    // =============================================
    console.log('PHASE 7: Testing Mute after unlock...');
    const muteBtn = page.locator('[data-testid="mute-btn"]').first();
    const unmuteBtn = page.locator('[data-testid="unmute-btn"]').first();

    const isMuteDisabled = await muteBtn.isDisabled();
    if (!isMuteDisabled) {
      await muteBtn.click();
      await expect(page.locator('text=Confirm Mute')).toBeVisible({ timeout: 5000 });
      await page.locator('button:has-text("Mute")').last().click();
      await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Muted!' })).toBeVisible({ timeout: 15000 });
      console.log('Mute after unlock successful!');
    } else {
      console.log('User already muted, skipping Mute');
    }

    // =============================================
    // PHASE 8: Unmute action (after unlock)
    // =============================================
    console.log('PHASE 8: Testing Unmute after unlock...');
    await expect(unmuteBtn).toBeEnabled({ timeout: 5000 });
    await unmuteBtn.click();
    await expect(page.locator('text=Confirm Unmute')).toBeVisible({ timeout: 5000 });
    await page.locator('button:has-text("Unmute")').last().click();
    await expect(page.locator('[data-testid="toast-success"]').filter({ hasText: 'Unmuted!' })).toBeVisible({ timeout: 15000 });
    console.log('Unmute after unlock successful!');

    console.log('ALL TESTS PASSED - F5 + Unlock flow verified!');
  });
});
