import Service from './service.js'


const data = {
  username: `bertoldoklinger-${Date.now()}`,
  password: 'minhasenhasecreta'
}

const service = new Service({
  filename: './users.ndjson'
})

await service.create(data)

const users = await service.read()

console.log('users', users)