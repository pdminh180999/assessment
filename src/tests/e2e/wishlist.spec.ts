import { test, expect } from '@playwright/test'

test.describe('Wishlist Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should create a new wishlist', async ({ page }) => {
    await page.click('button[id="add-edit-button"]')
    await page.click('button[id="add-wishlist"]')
    await page.click('button:has-text("Generate Random Color")')
    await page.fill('input[id="stackName"]', 'My Test Wishlist')
    await page.click('button:has-text("Create")')
    await expect(page.locator('text=My Test Wishlist')).toBeVisible()
  })

  test('should delete a wishlist', async ({ page }) => {
    await page.click('button[id="add-edit-button"]')
    await page.click('button[id="add-wishlist"]')
    await page.click('button:has-text("Generate Random Color")')
    await page.fill('input[id="wishlist-name"]', 'Test Delete')
    await page.click('button:has-text("Create")')
    await page.click('button[aria-label="Wishlist options menu"]')
    await page.click('button[aria-label="Delete wishlist"]')
    await expect(page.locator('text=Test Delete')).not.toBeVisible()
  })

  test('should display empty state when no wishlists', async ({ page }) => {
    await expect(page.locator('text=No stacks found')).toBeVisible()
  })
})
