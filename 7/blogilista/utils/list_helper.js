/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return (blogs.reduce(reducer, 0))
}

const favoriteBlog = (blogs) => {
  const reducer = (favorite, current) => {
    return (favorite.likes > current.likes) ? favorite : current
  }
  return (blogs.reduce(reducer, 'empty list, no favorites'))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}