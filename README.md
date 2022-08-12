# OpenQ-Graph

`yarn codegen`: Creates a `generated` directory with TypeScript bindings for your contract

`yarn deploy`: Create a `build` directory with your WASM compiled Graph node indexer and GraphQL API

## Local Development

[The Graph Academy Guide to Local Subgraph Development](https://thegraph.academy/developers/local-development/)

`deploy-local`: 

Queries (HTTP): https://api.thegraph.com/subgraphs/name/openqdev/openq

Subscriptions (WS): wss://api.thegraph.com/subgraphs/name/openqdev/openq

## OpenQ Development
 
graph auth --product hosted-service 9ecb0620e6ed41fd990baa5f3902a806

graph deploy --product hosted-service openqdev/openq-development

## OpenQ Staging

graph auth --product hosted-service 9ecb0620e6ed41fd990baa5f3902a806

graph deploy --product hosted-service openqdev/openq-development

## OpenQ Production

graph auth --product hosted-service 9ecb0620e6ed41fd990baa5f3902a806

graph deploy --product hosted-service openqdev/openq