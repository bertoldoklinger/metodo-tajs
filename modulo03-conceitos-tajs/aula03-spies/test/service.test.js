import { describe,it, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service'
import fs from 'fs/promises'
import crypto from 'node:crypto'

describe('Service Test Suite', () => {
  let _service
  const filename = 'testfile.ndjson'
  const MOCKED_HASH_PWD='hashed_password'

  beforeEach(()=> {
    _service = new Service({
      filename
    })
  })
  describe('#read',() => {
    it('should return an empty array if the file is empty', async () => {
      jest.spyOn( 
        fs,
        'readFile' 
      ).mockResolvedValue('')
      
      const result = await _service.read()
      expect(result).toEqual([])
    })

    it('should return users without password if file contains users', async () => {
      //arrange
      const dbData = [ 
        {
        username: "username1",
        password: "password1",
        createdAt: new Date().toISOString()
        },
        {
        username: "username2",
        password: "password2",
        createdAt: new Date().toISOString()
        },
      ]
      const fileContents = dbData.map((line) => JSON.stringify(line).concat('\n')).join('')
      
      jest.spyOn(
        fs,
        "readFile"
      ).mockResolvedValue(fileContents)
      //act
      const result = await _service.read(fileContents)
      //assert
      const expected = dbData.map(({password, ...rest})=> ({...rest}))

      expect(result).toEqual(expected)
    })
  })

  describe('#create - spies', () => {
    beforeEach(() => {
      jest
        .spyOn(
          crypto,
          crypto.createHash.name
        ).mockReturnValue({
          update: jest.fn().mockReturnThis()
          ,
          digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
        })

        jest.
          spyOn(
            fs,
            fs.appendFile.name
          ).mockResolvedValue()
      _service = new Service({
        filename
      })

    })
    
    it('should call appendFile with correct params',async () => {
      //arrange
      const input = {
        username: 'user1',
        password: 'pass1'
      }
      const expectedCreatedAt = new Date().toISOString()
      jest.
        spyOn(
          Date.prototype,
          Date.prototype.toISOString.name
          )
          .mockReturnValue(expectedCreatedAt)
    //act
          await _service.create(input)
    // assert
    expect(crypto.createHash).toHaveBeenCalledWith('sha256')
    expect(crypto.createHash).toHaveBeenCalledTimes(1)

    const hash = crypto.createHash('sha256')
    expect(hash.update).toHaveBeenCalledWith(input.password)
    expect(hash.digest).toHaveBeenCalledWith('hex')
    
    const expected = JSON.stringify({
      ...input,
      createdAt: expectedCreatedAt,
      password: MOCKED_HASH_PWD
    }).concat('\n')
    
    expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
    })

    
  })
})