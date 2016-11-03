var compression = require('compression')
var express = require('express')
const PORT = 3006
var app = express()
const data = require('../data.json')
const logs = (req, res, next) => {
  console.log(req.path)
  return next()
}
const shouldCompress = (req, res) => {
  if (req.path.indexOf('no-compress') === -1) {
    console.log('here')
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}
// compress responses
app
  .use(logs)
  .get('/data', compression(), (req, res) => {
    res.json({ data })
  })
  .get('/data-no-compress', (req, res) => {
    res.json({ data })
  })
// server-sent event stream
app.get('/events', compression(), function (req, res) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  let counter = 1
  var timer = setInterval(function () {
    res.write(`${counter})ping\n\n`)
    counter++
    // !!! this is the important part
    res.flush()
  }, 1000)

  res.on('close', function () {
    clearInterval(timer)
  })
})
app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log(`Server : ${PORT}`)
})
