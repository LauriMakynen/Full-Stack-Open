const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

//Testejä totalLikes-funktiolle
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  // Testataan, että funktio palauttaa tykkäysten määrän oikein, kun blogilistalla on vain yksi blogi
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  // Testataan, että funktio laskee tykkäysten summan oikein, kun blogilistalla on useita blogeja
  test('when list has multiple blogs, equals the sum of likes', () => {
    const listWithMultipleBlogs = [
      ...listWithOneBlog,
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Another Blog',
        author: 'Another Author',
        url: 'http://www.example.com',
        likes: 3,
        __v: 0
      }
    ]
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 8)
  })
  // Testataan, että funktio palauttaa nollan, kun blogilista on tyhjä
  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

//Testejä favoriteBlog-funktiolle
describe('favorite blog', () => {
  const listWithMultipleBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Another Blog',
      author: 'Another Author',
      url: 'http://www.example.com',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'The Favorite One',
      author: 'Top Author',
      url: 'http://www.favorite.com',
      likes: 10,
      __v: 0
    }
  ]
  // Testataan, että funktio palauttaa sen blogin, jolla on eniten tykkäyksiä, ja että blogin tiedot ovat oikein
  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)

    assert.deepStrictEqual(result, {
      _id: '5a422aa71b54a676234d17fa',
      title: 'The Favorite One',
      author: 'Top Author',
      url: 'http://www.favorite.com',
      likes: 10,
      __v: 0
    })
  })    
  // Testataan, että funktio palauttaa null, kun blogilista on tyhjä
  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})
//Testejä mostBlogs-funktiolle
describe('most blogs', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]
  // Testataan, että funktio palauttaa sen bloggaajan, jolla on eniten blogeja, ja että blogien määrä on oikein
  test('returns the author with highest blog count', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
  // Testataan, että funktio palauttaa null, kun blogilista on tyhjä
  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})

//Testejä mostLikes-funktiolle
describe('most likes', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]
  // Testataan, että funktio palauttaa sen bloggaajan, jolla on eniten tykkäyksiä yhteensä, ja että tykkäysten määrä on oikein
  test('returns the author with highest like count', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
  // Testataan, että funktio palauttaa null, kun blogilista on tyhjä
  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})