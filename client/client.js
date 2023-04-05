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

const { greet: GreetPackage } = grpc.loadPackageDefinition(greetProtoDefinition)
const { GreetService } = GreetPackage
const client = new GreetService(
  '127.0.0.1:50051',
  grpc.credentials.createInsecure()
)

function callGreetings({ firstName, lastName }) {
  const greeting = {
    firstName,
    lastName,
  }
  return new Promise((resolve, reject) => {
    client.greet({ greeting }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

async function main() {
  const response = await callGreetings({
    firstName: 'John',
    lastName: 'Doe',
  })
  console.log(response)
}

main()
