import { it, describe, expect, beforeAll, afterAll,jest, beforeEach } from '@jest/globals'
import { server } from '../src/api.js'
/* 
- Deve cadastrar usuarios e definir uma categoria onde:
    - Jovens Adultos: 
      - Usuarios de 18-25
    - Adultos:
      - Usuarios de 26-50
    - Idosos
      - 51+
    - Menor
      - Estoura um erro!
*/

describe('API Users E2E Suite', () => {
  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => reject(err))
        server.once('listening', () => resolve())
    })
}

  async function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async function findUserById(id) {
    const user = await fetch(`${_testServerAddress}/users/${id}`)
    return user.json()
  }

let _testServer
let _testServerAddress

beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    _testServer = server.listen();

    await waitForServerStatus(_testServer)

    const serverInfo = _testServer.address()
    _testServerAddress = `http://localhost:${serverInfo.port}`
})

beforeEach(() => {
      //IMPORTANTE POIS O ANO QUE VEM O TESTE PODE QUEBRAR SEMPRE QUE ESTIVER USANDO DATAS , SEMPRE MOCKAR O TEMPO!
  jest.useFakeTimers({
    now: new Date('2023-12-26T00:00')
  })
})

afterAll(done => {
  server.closeAllConnections()
  _testServer.close(done)
})



  it('should register a new user with young-adult category', async () => {
    const expectedCategory = 'young-adult'

    const response = await createUser({
      name: 'Bertoldo Klinger',
      birthDay: '2000-01-01' //21 anos
    })
    expect(response.status).toBe(201) //created
    const result = await response.json()
    expect(result.id).not.toBeUndefined()

    const user = await findUserById(result.id)
    expect(user.category).toBe(expectedCategory)


  });
  it('should throw an error when registering a under-age user', async () => {
    const response = await createUser({
      name: 'Bertoldo Klinger',
      birthDay: '2018-01-01' // 5 anos
    })

    expect(response.status).toBe(400)
    const result = await response.json()
    expect(result).toEqual({
      message: 'User must be 18 or older'
    })
  });
  it('should register a new user with adult category', async () => {
    const expectedCategory = 'adult'
    const response = await createUser({
      name: 'Daniely Silva',
      birthDay: '1997-01-01'
    })

    expect(response.status).toBe(201)
    const result = await response.json()
    expect(result.id).not.toBeUndefined()
    const user = await findUserById(result.id)
    expect(user.category).toBe(expectedCategory)
  });
  it('should register a new user with senior category',  async () => {
    const expectedCategory = 'senior'
    const response = await createUser({
      name: 'Daniely Silva Velha',
      birthDay: '1930-01-01'
    })

    expect(response.status).toBe(201)
    const result = await response.json()
    expect(result.id).not.toBeUndefined()
    const user = await findUserById(result.id)
    expect(user.category).toBe(expectedCategory)
  });

})
