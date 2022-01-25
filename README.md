# nuromancy

A Docker-based nodeJS app for converting numerals from base-10 to base-X.

## Development

### Install node v12 and npm and dependencies

```bash
brew install node@12
npm install
```

### Run Service Directly

```bash
node src/lib/index.js
```

### Run unit tests

```bash
npm test
```

## Approach

This app is intended for use in a large organization, and is ideally deployed as a microservice due to the rapidly evolving
Best Practices in the Arabic-to-Roman-numeral conversion space, and to meet the near universal demand for
accurate Ancient Roman financial accounting throughout the modern enterprise. 

To meet these objectives, the `nuromancy` project provides:

* Reliable conversion of a reasonable range of Arabic numerals most likely to be encountered during normal business activities (1-3999) into 
clay-tablet/marble friendly serialization format.

* Vanilla JavaScript framework built with `npm` to minimize maintenance costs and maximize feature development velocity.

* Dockerfile for deployment as a container in AKS or EKS clusters.

* RxJS for parallelization, because of the unavoidable I/O boundness of the conversion algorithm, which depends on shouting across a crowded 
forum to an Azure Chisel Worker Pool.

* Jest for unit and integration testing.

## Future Enhancements

* Localization of error messages in Latin (also accepting sponsorship for Koine Greek translations)

* Support for zero (currently blocked until RFC-MCXVI is adopted)

## Links

* [Wikipedia: Roman numerals](https://en.wikipedia.org/wiki/Roman_numerals)