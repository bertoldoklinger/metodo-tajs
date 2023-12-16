import { describe,it, expect, beforeEach, jest } from '@jest/globals'
import Service from '../src/service'
import fs from 'fs/promises'
import fsSync from 'fs'

describe('Service Test Suite', () => {
  let _service
  const filename = 'testfile.ndjson'

  beforeEach(()=> {
    _service = new Service({
      filename
    })
  })
  describe('#read',() => {
    it('should throw if no file is provided', async () => {

        //arrange
        jest.spyOn(fsSync, 'existsSync').mockReturnValue(false)
        jest.spyOn(fs, 'readFile')
        .mockRejectedValue('no file was provided')
      
        //act
        const result = await _service.read()
        

        // assert
        expect(result).toEqual([])
      })

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
      jest.spyOn(fsSync, 'existsSync')
      .mockReturnValue(true)
      
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
})