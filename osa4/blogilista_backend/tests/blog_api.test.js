const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const getAuthToken = async () => {
  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'sekret' })

  return response.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'testuser', name: 'Test User', passwordHash })
  const savedUser = await user.save()

  const blogsWithUser = helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id }))
  const savedBlogs = await Blog.insertMany(blogsWithUser)

  savedUser.blogs = savedBlogs.map(blog => blog._id)
  await savedUser.save()
})
//Testaa, että blogit palautetaan JSON-muodossa, että kaikki blogit palautetaan ja että blogeilla on id-kenttä, 
// joka toimii uniikkina tunnisteena. Testaa myös, että uuden blogin luominen onnistuu, että jos likes-kenttä puuttuu, se saa arvon 0,
//  ja  blogia ei luoda, jos title tai url puuttuu. Lopuksi testataan, että blogin poisto ja päivitys onnistuvat. Näistä vielä erikseen infot
describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    const token = await getAuthToken()

    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //Testataan, että kaikki blogit palautetaan
  test('all blogs are returned', async () => {
    const token = await getAuthToken()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  //Testataan, että blogeilla on id-kenttä, joka toimii uniikkina tunnisteena.
  test('the unique identifier field is named id', async () => {
    const token = await getAuthToken()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const blog = response.body[0]

    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
//Testataan, että blogi sisältää luojan käyttäjätiedot
  test('blog includes creator user information', async () => {
    const token = await getAuthToken()
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)

    const blog = response.body[0]

    assert(blog.user)
    assert.strictEqual(blog.user.username, 'testuser')
    assert.strictEqual(blog.user.name, 'Test User')
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const token = await getAuthToken()

    const newBlog = {
      title: 'New test blog',
      author: 'Tester',
      url: 'https://testblog.com',
      likes: 7,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert(response.body.user)
    assert.strictEqual(response.body.user.username, 'testuser')

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('New test blog'))
  })
  //Testataan, että jos likes-kenttä puuttuu, se saa arvon 0
  test('if likes is missing, it defaults to 0', async () => {
    const token = await getAuthToken()

    const newBlog = {
      title: 'No likes blog',
      author: 'Tester',
      url: 'https://nolikes.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
    //Testataan, että blogi ei luoda, jos title tai url puuttuu
  test('fails with status code 400 if title is missing', async () => {
    const token = await getAuthToken()

    const newBlog = {
      author: 'Tester',
      url: 'https://missingtitle.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  //Testataan, että blogi ei luoda, jos title tai url puuttuu
  test('fails with status code 400 if url is missing', async () => {
    const token = await getAuthToken()

    const newBlog = {
      title: 'Missing url',
      author: 'Tester',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Tester',
      url: 'https://unauthorized.com',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})
//Testataan, että blogin poisto onnistuu ja että blogi todella poistuu tietokannasta
describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const token = await getAuthToken()
    
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const ids = blogsAtEnd.map(blog => blog.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with status code 403 if user is not the creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    // Luodaan toinen käyttäjä
    const anotherUserRes = await api
      .post('/api/users')
      .send({
        username: 'anotheruser',
        name: 'Another User',
        password: 'salainen',
      })
      .expect(201)

    // Kirjaudutaan toisella käyttäjällä ja saadaan token
    const anotherUserToken = (await api
      .post('/api/login')
      .send({ username: 'anotheruser', password: 'salainen' })).body.token

    // Yritetään poistaa blogi väärällä käyttäjällä
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${anotherUserToken}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})
//Testataan, että blogin päivitys onnistuu ja että blogin tiedot todella päivittyvät tietokannassa
describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const token = await getAuthToken()
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: 99,
    }
    //Testataan, että päivitys onnistuu ja että vastaus sisältää päivitetyt tiedot
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 99)

    const blogsAtEnd = await helper.blogsInDb()
    const changedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(changedBlog.likes, 99)
  })
})

after(async () => {
  await mongoose.connection.close()
})