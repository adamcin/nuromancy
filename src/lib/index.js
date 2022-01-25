const express = require('express')
const handlers = require('./handlers')
const app = express()
const port = 3000

app.get('/', handlers.helloWorld)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
