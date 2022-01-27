/**
 * Copyright 2022 Mark Adamcin. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const express = require('express')
const appInsights = require('applicationinsights')
const app = express()
const expressAi = require('./expressAi')
const handlers = require('./handlers')

// initialize ai default client if env var is present. 
// otherwise, init logger with default console facade.
const ai = function () {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    // setup sdk with implicit instrumentation key provided by ENV var
    // APPINSIGHTS_INSTRUMENTATIONKEY
    appInsights.setup()
      .setAutoCollectRequests(false)
      .setAutoCollectExceptions(false)
      .start()

    return expressAi.initAppLogger(app, appInsights.defaultClient)
  } else {
    return expressAi.initAppLogger(app)
  }
}()

// setup app routes.
app.use(ai.logRequest)
app.get('/', handlers.indexHtml)
app.get('/romannumeral', handlers.romanNumeral)
app.use(ai.logErrors)

// start the server
const port = 8080
app.listen(port, () => {
  app.locals.log.traceInfo(`nuromancy service listening on port ${port}`)
})
