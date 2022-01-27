/**
 * Copyright 2022 Mark Adamcin. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// implicit const jest = require('jest')
const handlers = require('./../handlers')

test('testing hello world', () => {
  const req = {}, res = { send: jest.fn() }

  handlers.helloWorld(req, res)
  expect(res.send.mock.calls[0][0]).toBe('Hello World!')
})

test('romanNumeral: test empty query string', async () => {
  const req = {}, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
  })
})

test('romanNumeral: test simple case: 0 -> error', async () => {
  const req = { query: { query: '0' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
    expect(res.send.mock.calls[0][0]).toHaveProperty('error')
  })
})

test('romanNumeral: test simple case: 4000 -> error', async () => {
  const req = { query: { query: '4000' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
    expect(res.send.mock.calls[0][0]).toHaveProperty('error')
  })
})

test('romanNumeral: test simple case: 1 to I', async () => {
  const req = { query: { query: '1' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(200)
    expect(res.send.mock.calls[0][0]).toStrictEqual({ 'input': '1', 'output': 'I' })
  })
})

test('romanNumeral: test simple case: 2 to II', async () => {
  const req = { query: { query: '2' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(200)
    expect(res.send.mock.calls[0][0]).toStrictEqual({ 'input': '2', 'output': 'II' })
  })
})

test('romanNumeral: test simple case: 3 to III', async () => {
  const req = { query: { query: '3' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(200)
    expect(res.send.mock.calls[0][0]).toStrictEqual({ 'input': '3', 'output': 'III' })
  })
})

test('romanNumeral: range test simple error: 0 to 2', async () => {
  const req = { query: { min: '0', max: '2' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
    expect(res.send.mock.calls[0][0]).toHaveProperty('error')
  })
})

test('romanNumeral: range test simple error: 3998 to 4000', async () => {
  const req = { query: { min: '0', max: '2' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
    expect(res.send.mock.calls[0][0]).toHaveProperty('error')
  })
})

test('romanNumeral: range test simple error: 1 to 1', async () => {
  const req = { query: { min: '1', max: '1' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(400)
    expect(res.send.mock.calls[0][0]).toHaveProperty('error')
  })
})


test('romanNumeral: range test simple case: 1 to 2', async () => {
  const req = { query: { min: '1', max: '2' } }, res = { send: jest.fn(), status: jest.fn() }
  res.status.mockReturnValue(res);
  await handlers.romanNumeral(req, res).finally(() => {
    expect(res.status.mock.calls[0][0]).toBe(200)
    expect(res.send.mock.calls[0][0])
      .toStrictEqual({ 'conversions': [{ 'input': '1', 'output': 'I' }, { 'input': '2', 'output': 'II' }] })
  })
})
