# nuromancy

[![Node.js CI](https://github.com/adamcin/nuromancy/actions/workflows/node.js.yml/badge.svg)](https://github.com/adamcin/nuromancy/actions/workflows/node.js.yml)

[![Docker Image CI](https://github.com/adamcin/nuromancy/actions/workflows/docker-image.yml/badge.svg)](https://github.com/adamcin/nuromancy/actions/workflows/docker-image.yml)

[![codecov](https://codecov.io/gh/adamcin/nuromancy/branch/main/graph/badge.svg?token=EJCHG8H8R2)](https://codecov.io/gh/adamcin/nuromancy)

A Docker-based nodeJS app for converting numerals from base-10 to base-X.

## Usage

The app has two primary usage modes:

### `GET /romannumeral?query={integer}`

Convert a single Arabic numeral to a Roman numeral. 

Allowed values for the `query` parameter are integers between `1` and `3999`, inclusive.

Example Request:

```
GET /romannumeral?query=2022
Host: localhost:8080
```

Response:

```json
{"input":"2022", "output":"MMXXII"}
```

### `GET /romannumeral?min={integer}&max={integer}`

Convert a range of Arabic numerals to equivalent Roman numerals. The response will contain a `conversions` collection of the same response objects that would be returned if each number of the range were converted individually.

Allowed values for the `min` and `max` parameters are integers between `1` and `3999`, inclusive. In addition, the value of the `min` parameter must be numerically less than the value of the `max` parameter.

```
GET /romannumeral?min=5&max=7
Host: localhost:8080
```

Response:

```json
{"conversions":[{"input":"5","output":"V"},{"input":"6","output":"VI"},{"input":"7","output":"VII"}]}
```

### `GET /`

For convenience when manually testing the service in a browser, a simple html page is served for the root resource that displays two forms: A `single` conversion form accepting a `Query` parameter, and a `range` conversion form accepting `Min` and `Max` parameters. 

Submitting either form will trigger the appropriate service response, and be displayed using the browser's default JSON rendering behavior.

## Welcome

This app is intended for use in a large organization, and is ideally deployed as a microservice due to the rapidly evolving
Best Practices in the Arabic-to-Roman-numeral conversion space, and to meet the near universal demand for
accurate Ancient Roman financial accounting throughout the modern enterprise. 

To meet these objectives, the `nuromancy` project provides:

* Reliable conversion of a reasonable range of Arabic numerals most likely to be encountered during normal business activities (1-3999) into 
clay-tablet/marble friendly serialization format.

* Vanilla JavaScript app built with `npm` and `express` to minimize maintenance costs and maximize feature development velocity.

* Dockerfile for deployment as a container in AKS or EKS clusters.

* Parallelization for Arabic range request processing, because of the unavoidable I/O boundness of the conversion algorithm, which depends on shouting across a crowded 
forum to an Azure Chisel Worker Pool.

* Jest for unit and integration testing.

## Packaging and Distribution

* The production distribution of the app consists of a single `worker.js` script that is executable by node v12+.

* A Dockerfile is provided that runs a multistage build to produce an image derived from `node:12-alpine` with the app script located at `/app/worker.js`, and which exposes port `8080`.

* Support for Azure AppInsights is included in the app, but the AppInsights SDK subsystem is not currently subjected to unit testing during CI.

## Engineering & Testing Methodology

* All changes are expected to be submitted as pull requests for review prior to merge to `main`.

* All PRs require passing unit tests and 100% code coverage for business logic in `convert.js` and `handlers.js`.

* All PRs require a successful docker image build.

### Why JavaScript instead of Java?

All features of `nuromancy` could have been just as easily implemented in a Spring Boot project or other modern Java framework, but I wanted to demonstrate a level of proficiency in modern JavaScript programming, as well as to demonstrate an ability to build a node server project from scratch, while making deliberate, incremental decisions about which tools to integrate to maintain code quality and reliability as the project matures.

For insight into my development approach for Java-based projects, I would recommend glancing through my Github project for [OakPAL](https://github.com/adamcin/oakpal). 

## How to Build and Run `nuromancy`

### Install node v12 and npm and dependencies

```bash
brew install node@12
npm install
```

### Run Service Directly

```bash
npm run start
```

### Run unit tests

```bash
npm test
```

### Run Service with Live Reload using Nodemon

```bash
npm run watch
```

### Build and run single worker.js using Parcel

```bash
npm run build
node ./dist/worker.js
```

### Build and Run as Docker Container

In Codespaces, you can run the following commands to build and run the app in the background as a container:

```bash
docker build -t nuromancy .
docker run --rm --detach -p 8080:8080 nuromancy:latest
```

After this, switch to the Ports tab and Cmd+click the link to open the root path in a new browser tab. 

### Running within Azure

To enable AppInsights logging and tracing within an Azure context, you must provide your App Insights Instrumentation Key using the `APPINSIGHTS_INSTRUMENTATIONKEY` environment variable. For example, when running as a Docker container:

```bash
docker run --rm --detach -p 8080:8080 -e APPINSIGHTS_INSTRUMENTATIONKEY=${APPINSIGHTS_INSTRUMENTATIONKEY} nuromancy:latest
```

## Dependency Attribution

### Runtime

* [Express JS](https://expressjs.com/): HTTP server library with easy routing and minimal boilerplate

* [Microsoft Azure Application Insights for Node JS](https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs): Azure SDK for sending monitoring, logging, and request tracing telemetry to Application Insights

### Dev Dependencies

* [Jest](https://jestjs.io/): Unit test library for JavaScript

* [Codecov](https://about.codecov.io/): Node JS SDK for uploading Jest unit test code coverage metrics to Codecov during CI pipelines.

* [nodemon](https://www.npmjs.com/package/nodemon): nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

* [parcel](https://parceljs.org/): Web resource packaging tool for Node that we use to produce a single worker.js file for efficient distribution in Docker.

## Future Enhancements

* Localization of error messages in Latin (also accepting sponsorship for Koine Greek translations)

* Support for zero (currently blocked until RFC-MCXVI is adopted)

## Links

* [Wikipedia: Roman numerals](https://en.wikipedia.org/wiki/Roman_numerals)

* [Developing Azure Application Insights logging for Express](https://medium.com/@gasiorowski.piotr/developing-azure-application-insights-logging-for-express-ae975c5e984)

