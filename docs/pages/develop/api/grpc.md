
## 1. What is gRPC ?

### 1.1 Overview

[gRPC](http://grpc.io) is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.

One of the primary benefits of using gRPC is for documentation; you can use your service configuration and API interface definition files to generate reference documentation for your API.

### 1.2 What you need to know

- gRPC underlying protocol is HTTP/2. It always blocking, asynchronous and reactive communications.

- Payloads are serialized in **binary** format call protocol buffers.

- Associated with protocol buffers the interfaces are define with `.proto` definitions files. From those definitions both server and clients are generated (stubbs).

Apache Cassandra is a NoSQL Distributed database built for performance. This fits very well use cases where this technology shines : when the performance requirements are demanding.


## 2. How is it exposed in Astra ?

The stargate team considers that gRPC could become the future of drivers for Apache Cassandra as describe in the [following blogpost](https://stargate.io/2022/01/15/stargate-grpc-the-better-way-to-cql.html).

As a consequence a grpc API layer is available within [Stargate](stargate.io). Stargate is deployed within Astra and this is how Astra can provides a gRPC Api.

<img src="../../../../img/stargate-api-grpc/architecture.png" />

## 3. Getting Started

### 3.1 Prerequisites

- [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- [Create an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)


### 3.2 Implementation

- Download to the `.proto` files. For Stargate they can be found [here]()

- Generate the stubs base on the proto files. In the case of Stargate gRPC apis datastax has already generated those stubs for a couple of languagues
    - [Java grpcClient](https://github.com/stargate/stargate-grpc-java-client)
    - [Rust grpcClient](https://github.com/stargate/stargate-grpc-rust-client)
    - [Go grpcClient](https://github.com/stargate/stargate-grpc-go-client)
    - [Node grpcClient](https://github.com/stargate/stargate-grpc-node-client)

- 


