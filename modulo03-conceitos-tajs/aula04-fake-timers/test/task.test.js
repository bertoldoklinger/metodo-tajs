import { describe,it, expect, beforeEach, jest } from '@jest/globals'
import Task from '../src/task.js'
import {setTimeout} from 'node:timers'


describe('Task Test Suite', () => {
  let _logMock;
  let _task
  beforeEach(() => {
    _logMock = jest.spyOn(
      console, 
      console.log.name
      ).mockImplementation()

    _task = new Task()
  })
  it.skip('should only run tasks that are due without fake timers (slow)',async () => {
    //arrange
    const tasks = [
      {
        name: 'Task-Will-Run-in-5-Secs',
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn()
      },
      {
        name: 'Task-Will-Run-in-5-Secs',
        dueAt: new Date(Date.now() + 10000),//10 segundos
        fn: jest.fn()
      },
      
    ]
    //act
    _task.save(tasks.at(0))
    _task.save(tasks.at(1))
    _task.run(200) //200ms

    await setTimeout(11000) // 11_000


    expect(tasks.at(0).fn).toHaveBeenCalled()
    expect(tasks.at(1).fn).toHaveBeenCalled()
  }, 
  //configurar para o jest aguardar 15 segundos nesse teste
  15000
  );
  it('should only run tasks that are due with fake timers (fast)',async () => {
    jest.useFakeTimers()
    //arrange
    const tasks = [
      {
        name: 'Task-Will-Run-in-5-Secs',
        dueAt: new Date(Date.now() + 5000),
        fn: jest.fn()
      },
      {
        name: 'Task-Will-Run-in-5-Secs',
        dueAt: new Date(Date.now() + 10000),//10 segundos
        fn: jest.fn()
      },
      
    ]
    //act
    _task.save(tasks.at(0))
    _task.save(tasks.at(1))
    _task.run(200) //200ms


    jest.advanceTimersByTime(4000)
    //ninguem deve ser executado ainda
    expect(tasks.at(0).fn).not.toHaveBeenCalled()
    expect(tasks.at(1).fn).not.toHaveBeenCalled()


    jest.advanceTimersByTime(2000)
    //4 + 2 = 6 só a primeira tarefa deve executar
    expect(tasks.at(0).fn).toHaveBeenCalled()
    expect(tasks.at(1).fn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(4000)
    //4 + 2 + 4 = 10 só a segunda tarefa deve executar
    expect(tasks.at(1).fn).toHaveBeenCalled()

    jest.useRealTimers()
  });
})
