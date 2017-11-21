const clone = require('clone')

let db = {}

const defaultData = {
  "jaa6f57k": {
    id: 'jaa6f57k',
    timestamp: 1511302387232,
    title: 'I have a theory ... not sure yet !!SPOILERS',
    body: 'I think Darth Vader is Lukes dad...maybe... any ideas?',
    author: 'secre_trekkie',
    category: 'starwars',
    voteScore: -4,
    deleted: false,
    commentCount: 1,
  },
  "jaa6glc8": {
    id: 'jaa6glc8',
    timestamp: 1511302454792,
    title: 'Okay, do we really need this many cats on the internet?',
    body: 'Just saying..i like cats...but Im afraid the cats may take over soon.....',
    author: 'doglover',
    category: 'cats',
    voteScore: -5,
    deleted: false,
    commentCount: 1,
  },
  "jaa6d7m7": {
    id: 'jaa6d7m7',
    timestamp: 1511302297038,
    title: 'Guys, DC rocks, i dont even like Marvel',
    body: 'Just Kidding',
    author: 'lolguys',
    category: 'marvel',
    voteScore: -6,
    deleted: false,
    commentCount: 0,
  }
}

function getData (token) {
  let data = db[token]
  if (data == null) {
    data = db[token] = clone(defaultData)
  }
  return data
}

function getByCategory (token, category) {
  return new Promise((res) => {
    let posts = getData(token)
    let keys = Object.keys(posts)
    let filtered_keys = keys.filter(key => posts[key].category === category && !posts[key].deleted)
    res(filtered_keys.map(key => posts[key]))
  })
}

function get (token, id) {
  return new Promise((res) => {
    const posts = getData(token)
    res(
      posts[id].deleted
        ? {}
        : posts[id]
    )
  })
}

function getAll (token) {
  return new Promise((res) => {
    const posts = getData(token)
    let keys = Object.keys(posts)
    let filtered_keys = keys.filter(key => !posts[key].deleted)
    res(filtered_keys.map(key => posts[key]))
  })
}

function add (token, post) {
  return new Promise((res) => {
    let posts = getData(token)

    posts[post.id] = {
      id: post.id,
      timestamp: post.timestamp,
      title: post.title,
      body: post.body,
      author: post.author,
      category: post.category,
      voteScore: 1,
      deleted: false,
      commentCount: 0
    }

    res(posts[post.id])
  })
}

function vote (token, id, option) {
  return new Promise((res) => {
    let posts = getData(token)
    post = posts[id]
    switch(option) {
        case "upVote":
            post.voteScore = post.voteScore + 1
            break
        case "downVote":
            post.voteScore = post.voteScore - 1
            break
        default:
            console.log(`posts.vote received incorrect parameter: ${option}`)
    }
    res(post)
  })
}

function disable (token, id) {
    return new Promise((res) => {
      let posts = getData(token)
      posts[id].deleted = true
      res(posts[id])
    })
}

function edit (token, id, post) {
    return new Promise((res) => {
        let posts = getData(token)
        for (prop in post) {
            posts[id][prop] = post[prop]
        }
        res(posts[id])
    })
}

function incrementCommentCounter(token, id, count) {
  const data = getData(token)
  if (data[id]) {
    data[id].commentCount += count
  }
}

module.exports = {
  get,
  getAll,
  getByCategory,
  add,
  vote,
  disable,
  edit,
  getAll,
  incrementCommentCounter
}
