# nuromancy

[![Node.js CI](https://github.com/adamcin/nuromancy/actions/workflows/node.js.yml/badge.svg)](https://github.com/adamcin/nuromancy/actions/workflows/node.js.yml)

[![Docker Image CI](https://github.com/adamcin/nuromancy/actions/workflows/docker-image.yml/badge.svg)](https://github.com/adamcin/nuromancy/actions/workflows/docker-image.yml)

[![codecov](https://codecov.io/gh/adamcin/nuromancy/branch/main/graph/badge.svg?token=EJCHG8H8R2)](https://codecov.io/gh/adamcin/nuromancy)

A Docker-based nodeJS app for converting numerals from base-10 to base-X.

## Development

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
docker run --rm --detach --port 8080:8080 nuromancy:latest
```

After this, switch to the Ports tab and Cmd+click the link to open the root path in a new browser tab. 

## Approach

This app is intended for use in a large organization, and is ideally deployed as a microservice due to the rapidly evolving
Best Practices in the Arabic-to-Roman-numeral conversion space, and to meet the near universal demand for
accurate Ancient Roman financial accounting throughout the modern enterprise. 

To meet these objectives, the `nuromancy` project provides:

* Reliable conversion of a reasonable range of Arabic numerals most likely to be encountered during normal business activities (1-3999) into 
clay-tablet/marble friendly serialization format.

* Vanilla JavaScript framework built with `npm` to minimize maintenance costs and maximize feature development velocity.

* Dockerfile for deployment as a container in AKS or EKS clusters.

* Parallelization for Arabic range request processing, because of the unavoidable I/O boundness of the conversion algorithm, which depends on shouting across a crowded 
forum to an Azure Chisel Worker Pool.

* Jest for unit and integration testing.

## Future Enhancements

* Localization of error messages in Latin (also accepting sponsorship for Koine Greek translations)

* Support for zero (currently blocked until RFC-MCXVI is adopted)

## Links

* [Wikipedia: Roman numerals](https://en.wikipedia.org/wiki/Roman_numerals)