import { test, expect } from "@playwright/test"

test.describe("Resume Builder", () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto("/dashboard")
    await page.waitForLoadState("networkidle")
  })

  test("should complete resume creation flow", async ({ page }) => {
    // Start creating a new resume
    await page.click("text=Create New Resume")
    await expect(page).toHaveURL("/resume/create")

    // Step 1: Personal Info
    await page.fill('[data-testid="fullName"]', "John Doe")
    await page.fill('[data-testid="email"]', "john@example.com")
    await page.fill('[data-testid="phone"]', "+1234567890")
    await page.click("text=Next")

    // Step 2: Education
    await page.click("text=Add Education")
    await page.fill('[data-testid="institution"]', "University of Test")
    await page.fill('[data-testid="degree"]', "Bachelor of Science")
    await page.click("text=Next")

    // Step 3: Experience
    await page.click("text=Add Experience")
    await page.fill('[data-testid="company"]', "Test Company")
    await page.fill('[data-testid="position"]', "Software Engineer")
    await page.fill('[data-testid="description"]', "Developed amazing software")
    await page.click("text=Next")

    // Continue through remaining steps
    await page.click("text=Next") // Projects
    await page.click("text=Next") // Skills
    await page.click("text=Next") // Job Description

    // Final step: Review
    await expect(page.locator("text=John Doe")).toBeVisible()
    await expect(page.locator("text=University of Test")).toBeVisible()
    await expect(page.locator("text=Test Company")).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    await page.goto("/resume/create")

    // Try to proceed without filling required fields
    await page.click("text=Next")

    // Should show validation errors
    await expect(page.locator("text=Full name is required")).toBeVisible()
    await expect(page.locator("text=Email is required")).toBeVisible()
  })

  test("should save resume draft", async ({ page }) => {
    await page.goto("/resume/create")

    // Fill some basic info
    await page.fill('[data-testid="fullName"]', "Jane Doe")
    await page.fill('[data-testid="email"]', "jane@example.com")

    // Save draft
    await page.click("text=Save Draft")

    // Should show success message
    await expect(page.locator("text=Draft saved successfully")).toBeVisible()
  })
})
