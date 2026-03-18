const dummy = (_blogs) => 1

// Funktio, joka laskee kaikkien blogien tykkäysten summan
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
// Funktio, joka palauttaa sen blogin, jolla on eniten tykkäyksiä
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
// Oletetaan, että ensimmäinen blogi on suosituin, ja käydään läpi kaikki blogit löytääksemme sen, jolla on eniten tykkäyksiä
  let favorite = blogs[0]
  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  }
  return favorite
}
// Funktio, joka palauttaa sen bloggaajan, jolla on eniten blogeja
const mostBlogs = (blogs) => {
  const authorCounts = {}
  for (let blog of blogs) {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  }

  let maxBlogs = 0
  let maxAuthor = null
  for (let author in authorCounts) {
    if (authorCounts[author] > maxBlogs) {
      maxBlogs = authorCounts[author]
      maxAuthor = author
    }
  }

  return maxAuthor ? { author: maxAuthor, blogs: maxBlogs } : null
}

// Funktio, joka selvittää, kuka bloggaaja on saanut eniten tykkäyksiä yhteensä
const mostLikes = (blogs) => {
  const authorLikes = {}
  for (let blog of blogs) {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  }

  let maxLikes = 0
  let maxAuthor = null
  for (let author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxLikes = authorLikes[author]
      maxAuthor = author
    }
  }

  return maxAuthor ? { author: maxAuthor, likes: maxLikes } : null
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}