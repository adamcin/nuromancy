const express = require('express')
const handlers = require('./handlers')
const app = express()
const port = 8080

app.get('/', handlers.helloWorld)

app.listen(port, () => {
  console.log(`nuromancy service listening on port ${port}`)
})
