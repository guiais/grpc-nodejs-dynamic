const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

const greetProtoPath = path.join(__dirname, './../protos/greet.proto')
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const { greet: greetPackage } = grpc.loadPackageDefinition(greetProtoDefinition)

function greet(call, callback) {
  const { request } = call
  const { firstName, lastName } = request.greeting

  callback(null, { result: `Hello ${firstName} ${lastName}!` })
}

function main() {
  const server = new grpc.Server()

  server.addService(greetPackage.GreetService.service, {
    greet,
  })

  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
  server.start()
  console.log('Server running at 127.0.0.1:50051')
}

main()
