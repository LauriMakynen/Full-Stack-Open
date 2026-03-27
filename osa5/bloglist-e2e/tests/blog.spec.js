const { test, expect, beforeEach, describe } = require('@playwright/test')

test.describe.configure({ mode: 'serial' })

describe('Blog app', () => {
   beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    //Siistitty baseURL
    await page.goto('/')
  })
  //Vaiheen 5.17 mukainen testi
  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form')
    await expect(loginForm).toBeVisible()
    
    const usernameInput = page.locator('input[type="text"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => { //5.18
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[type="text"]').fill('mluukkai')
      await page.locator('input[type="password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    //Vaiheen 5.18 mukainen testi
    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[type="text"]').fill('mluukkai')
      await page.locator('input[type="password"]').fill('väärä salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })
  //Vaiheen 5.19 mukainen testi
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[type="text"]').fill('mluukkai')
      await page.locator('input[type="password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    //Vaiheen 5.19 mukainen testi
    test('a new blog can be created', async ({ page }) => {
      const title = `Create test blog ${Date.now()}`
      const author = 'Matti Luukkainen'

      await page.getByRole('button', { name: 'create new blog' }).click()
      const blogFormInputs = page.locator('form').last().locator('input')
      await blogFormInputs.nth(0).fill(title)
      await blogFormInputs.nth(1).fill(author)
      await blogFormInputs.nth(2).fill('https://example.com/create-test')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText(`${title} ${author}`)).toBeVisible()
    })

    //Vaiheen 5.20 mukainen testi
    test('a blog can be liked', async ({ page }) => {
      const title = `Like test blog ${Date.now()}`
      const author = 'Matti Luukkainen'

      await page.getByRole('button', { name: 'create new blog' }).click()

      const blogFormInputs = page.locator('form').last().locator('input')
      await blogFormInputs.nth(0).fill(title)
      await blogFormInputs.nth(1).fill(author)
      await blogFormInputs.nth(2).fill('https://example.com/like-test')
      await page.getByRole('button', { name: 'create' }).click()

      const blogItem = page.locator('div[style*="border"]', { hasText: `${title} ${author}` })
      await expect(blogItem).toBeVisible()

      await blogItem.getByRole('button', { name: 'view' }).click()
      await expect(blogItem.getByText('likes 0')).toBeVisible()

      await blogItem.getByRole('button', { name: 'like' }).click()
      await expect(blogItem.getByText('likes 1')).toBeVisible()
    })

    //Vaiheen 5.21 mukainen testi
    test('a blog can be removed by the user who created it', async ({ page }) => {
      const title = `Remove test blog ${Date.now()}`
      const author = 'Matti Luukkainen'

      await page.getByRole('button', { name: 'create new blog' }).click()

      const blogFormInputs = page.locator('form').last().locator('input')
      await blogFormInputs.nth(0).fill(title)
      await blogFormInputs.nth(1).fill(author)
      await blogFormInputs.nth(2).fill('https://example.com/remove-test')
      await page.getByRole('button', { name: 'create' }).click()

      const blogItem = page.locator('div[style*="border"]', { hasText: `${title} ${author}` })
      await expect(blogItem).toBeVisible()

      await blogItem.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await blogItem.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText(`${title} ${author}`)).not.toBeVisible()
    })

    //Vaiheen 5.22 mukainen testi
    test('only the user who created a blog sees the remove button', async ({ page, request }) => {
      const title = `Owner visibility test ${Date.now()}`
      const author = 'Matti Luukkainen'

      await page.getByRole('button', { name: 'create new blog' }).click()

      const blogFormInputs = page.locator('form').last().locator('input')
      await blogFormInputs.nth(0).fill(title)
      await blogFormInputs.nth(1).fill(author)
      await blogFormInputs.nth(2).fill('https://example.com/owner-visibility')
      await page.getByRole('button', { name: 'create' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Toinen Kayttaja',
          username: 'toinen',
          password: 'salainen'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await page.locator('input[type="text"]').fill('toinen')
      await page.locator('input[type="password"]').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      const blogItem = page.locator('div[style*="border"]', { hasText: `${title} ${author}` })
      await expect(blogItem).toBeVisible()

      await blogItem.getByRole('button', { name: 'view' }).click()
      await expect(blogItem.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    //Vaiheen 5.23 mukaiset testit
    test('blogs are ordered by likes with the most liked first', async ({ page, request }) => {
      const author = 'Matti Luukkainen'
      const lowLikesTitle = `Low likes ${Date.now()}`
      const mediumLikesTitle = `Medium likes ${Date.now()}`
      const highLikesTitle = `High likes ${Date.now()}`

      const loginResponse = await request.post('http://localhost:3003/api/login', {
        data: {
          username: 'mluukkai',
          password: 'salainen'
        }
      })
      expect(loginResponse.ok()).toBeTruthy()

      const { token } = await loginResponse.json()
      const authHeaders = {
        Authorization: `Bearer ${token}`
      }

      const lowLikesBlogResponse = await request.post('http://localhost:3003/api/blogs', {
        data: {
          title: lowLikesTitle,
          author,
          url: 'https://example.com/low-likes',
          likes: 1
        },
        headers: authHeaders
      })
      expect(lowLikesBlogResponse.ok()).toBeTruthy()

      const mediumLikesBlogResponse = await request.post('http://localhost:3003/api/blogs', {
        data: {
          title: mediumLikesTitle,
          author,
          url: 'https://example.com/medium-likes',
          likes: 2
        },
        headers: authHeaders
      })
      expect(mediumLikesBlogResponse.ok()).toBeTruthy()

      const highLikesBlogResponse = await request.post('http://localhost:3003/api/blogs', {
        data: {
          title: highLikesTitle,
          author,
          url: 'https://example.com/high-likes',
          likes: 3
        },
        headers: authHeaders
      })
      expect(highLikesBlogResponse.ok()).toBeTruthy()

      await page.goto('/')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByText(lowLikesTitle)).toBeVisible()
      await expect(page.getByText(mediumLikesTitle)).toBeVisible()
      await expect(page.getByText(highLikesTitle)).toBeVisible()

      const blogCards = page.locator('div[style*="border"]')
      const cardTexts = await blogCards.allTextContents()

      const highIndex = cardTexts.findIndex(text => text.includes(highLikesTitle))
      const mediumIndex = cardTexts.findIndex(text => text.includes(mediumLikesTitle))
      const lowIndex = cardTexts.findIndex(text => text.includes(lowLikesTitle))

      expect(highIndex).toBeGreaterThanOrEqual(0)
      expect(mediumIndex).toBeGreaterThanOrEqual(0)
      expect(lowIndex).toBeGreaterThanOrEqual(0)
      expect(highIndex).toBeLessThan(mediumIndex)
      expect(mediumIndex).toBeLessThan(lowIndex)
    })
  })
})
