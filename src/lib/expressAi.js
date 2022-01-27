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

const uuid = require('uuid')

/**
 * Logging interface wrapping the AppInsights SDK.
 */
class Logger {
    ai;

    constructor(ai) { this.ai = ai }

    /**
     * INFO level to be used by index.js startup message.
     * 
     * @param {string} message 
     * @param {[key: string]: string} properties 
     */
    traceInfo(message, properties) {
        this.ai.trackTrace({ message: message, severity: 1, properties: properties })
    }

    /**
     * ERROR level to be used for internal Express JS errors.
     * 
     * @param {Error} error
     * @param {[key: string]: string} properties
     */
    traceError(error, properties) {
        this.ai.trackException({ exception: error, properties: properties })
    }

    /**
     * Request tracing for the logRequests middleware.
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @param {[key: string]: string} properties 
     */
    trackRequest(req, res, properties) {
        this.ai.trackNodeHttpRequest({ request: req, response: res, properties: properties })
    }
}

/**
 * AppInsights facade that sends telemetry to the console.
 */
const consoleFacade = {
    trackTrace: (telemetry) => {
        console.log('TRACE:', telemetry)
    },

    trackException: (telemetry) => {
        console.error('ERROR:', telemetry)
    },

    trackNodeHttpRequest: (telemetry) => {
        // don't log all the request/response details to the console, because that's overwhelming
        const { request, response, properties } = telemetry
        console.info('REQUEST:', { method: request.method, url: request.url, properties: properties })
    }
}

exports.initAppLogger = (expressApp, ai) => {
    // if ai client is not provided default to the console facade
    const client = ai !== undefined ? ai : consoleFacade
    // wrap it with a logger
    const logger = new Logger(client)
    // set it to app locals
    expressApp.locals.log = logger

    return {
        /**
         * Middleware for logging requests over AppInsights.
         * 
         * @param {express.Request} req 
         * @param {express.Response} res 
         * @param {express.NextFunction} next 
         */
        logRequest: (req, res, next) => {
            res.locals.log = logger
            res.locals.requestId = uuid.v4()

            logger.trackRequest(req, res, {
                requestId: res.locals.requestId
            })

            next()
        },

        /**
         * Middleware for logging errors over AppInsights.
         * 
         * @param {Error} error 
         * @param {express.Request} req 
         * @param {express.Response} res 
         * @param {express.NextFunction} next 
         */
        logErrors: (error, req, res, next) => {
            logger.traceError(error, '', {
                url: req.url,
                requestId: res.locals.requestId
            })

            next(error)
        }
    }
}