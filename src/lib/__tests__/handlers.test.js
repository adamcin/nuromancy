// implicit const jest = require('jest')
const handlers = require('./../handlers')

test('testing hello world', () => {
  const req = {}, res = { send: jest.fn() }

  handlers.helloWorld(req, res)
  expect(res.send.mock.calls[0][0]).toBe('Hello World!')
})