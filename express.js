const express = require('express')
const app = express()

app
  .get('/', (req, res) => {
    return res.json({ code: 'ok' })
  })
  .get('/json', (req, res) => {
    const data = require('./data.json')
    return res.json({
      code: 'ok',
      body: data
    })
  })
  .use((req, res, next) => {
    return res.json({
      code: 'ok',
      body: 'not found'
    })
  })
  .use((err, req, res, next) => {
    return res.json({
      code: 'error',
      error: err
    })
  })
