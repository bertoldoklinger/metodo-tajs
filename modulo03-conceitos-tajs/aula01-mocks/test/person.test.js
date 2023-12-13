import { describe, it, expect, afterEach, jest } from '@jest/globals'
import Person from '../src/person';

describe('#Person Suite', () => {
  afterEach(() => {
    Person.persons = [];
  });

  describe('#validate', () => {
    it('should throw if no name is passed', () => {
      //mock é a entrada necessaria para que o teste funcione
      const mockInvalidPerson = {
        name: '',
        cpf: "123.456.789-00"
      }

      expect(() => Person.validate(mockInvalidPerson)).toThrowError('name is required')
    });
    it('should throw if no cpf is passed', () => {
      //mock é a entrada necessaria para que o teste funcione
      const mockInvalidPerson = {
        name: 'Bertoldo Klinger',
        cpf: ""
      }

      expect(() => Person.validate(mockInvalidPerson)).toThrowError("cpf is required")
    });
    it('should pass with correct input values name and cpf', () => {
      //mock é a entrada necessaria para que o teste funcione
      const mockValidPerson = {
        name: 'Bertoldo Klinger',
        cpf: "123.456.789-10"
      }
  
      expect(() => Person.validate(mockValidPerson)).not.toThrow()
    });
  })

  describe('#format', () => {
    it('should format person with correct input', () => {
      // parte do principio que os dados já foram validados
      //arrange
      const mockPerson = {
        name: "Bertoldo Klinger da Silva",
        cpf: "123.456.789-10"
      }

      //act
      const formattedPerson = Person.format(mockPerson)
      const expected = {
        cpf: '12345678910',
        name: 'Bertoldo',
        lastName: 'Klinger da Silva'
      }

      //assert
      expect(formattedPerson).toStrictEqual(expected)
    });
  });

  describe('#save', () => {
    it('should save the person with correct props', () => {
      //arrange
      const mockPerson = {
        cpf: '05412792383',
        name: "Bertoldo",
        lastName: "Klinger",
      }
      const personSaved = Person.save(mockPerson)

      expect(personSaved).toBe('registrado com sucesso')
      expect(Person.persons[0]).toEqual(mockPerson)
    });  
    it('should throw if wrong prop is passed by', () => {
      //arrange
      const invalidMockPerson = {
        cnpj: '05412792383',
        wrong_name: "Bertoldo",
        wrong_lastName: "Klinger",
      }
      //act
      const personSaved = () => Person.save(invalidMockPerson)
      //assert
      expect(personSaved).toThrowError(`cannot save invalid person: ${JSON.stringify(invalidMockPerson)}`)
    });  
  });
  
  describe('#process', () => {
    it('should process a valid person', () => {
      // uma outra ideia é não retestar oque já foi testado
      // checkpoints => testou do caminho a ao caminho b ,
      // agora testa do caminho b ao caminho c
      // então aqui eu pulo o caminho a(validate), o caminho b(format), e o caminho c(save), pois esses 
      // caminhos já foram validados

      //Este método abaixo faz mais sentido para quando se tem interações externas como chamadas de api,
      //bancos de dados, etc

      //arrange
      const mockPerson = {
        name: "Bertoldo Klinger",
        cpf: '123.456.789-00'
      }
      jest.spyOn(
        Person,
        Person.validate.name
      )
      // .mockReturnValue()
      .mockImplementation(() => {
        throw new Error('deu ruim!!')
      })

      jest.spyOn(
        Person, Person.format.name
        ).mockReturnValue({
          cpf: "12345678900",
          name: "Bertoldo",
          lastName: "Klinger"
        })

        //act
        const result = Person.process(mockPerson)

        //assert
        const expected = 'ok'
        expect(result).toStrictEqual(expected)
    })
  })
  
})