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

const { MAX_INPUT, MIN_INPUT, parseArabic, expectWithinRange, toRoman } = require("../convert")

test('expectWithinRange: expect all inputs between MIN_INPUT and MAX_INPUT to return parsed versions of themselves', async () => {
    // generate an array of all allowed inputs
    const inputs = Array.from({ length: MAX_INPUT - MIN_INPUT + 1 }, (v, k) => { return MIN_INPUT + k })

    // map the inputs to an array of promises for the parsed and range-checked outputs
    const outputPromises = inputs
        .map(value => value.toString(10))
        .map(input => parseArabic(input).then(integer => expectWithinRange(integer))) // string => Promise<number>()

    // await the promises in a for-loop to avoid passing an async function to Array.map
    const outputs = []
    for (var i = 0; i < outputPromises.length; i++) {
        const result = await outputPromises[i].catch(() => 0)
        outputs.push(result)
    }

    // deep compare the inputs to the outputs
    expect(outputs).toEqual(expect.arrayContaining(inputs))
})

// perform some checks for throws near min/max input bounds
test('expectWithinRange: check conversion bounds', async () => {
    await expect(expectWithinRange(MIN_INPUT)).resolves.toBe(MIN_INPUT)
    await expect(expectWithinRange(MAX_INPUT)).resolves.toBe(MAX_INPUT)
    await expect(expectWithinRange(MIN_INPUT - 1)).rejects.toThrow(RangeError)
    await expect(expectWithinRange(MAX_INPUT + 1)).rejects.toThrow(RangeError)
    await expect(expectWithinRange(MIN_INPUT.toString(10))).rejects.toThrow(TypeError)
    await expect(expectWithinRange(MAX_INPUT.toString(10))).rejects.toThrow(TypeError)
    await expect(expectWithinRange(NaN)).rejects.toThrow(TypeError)
})

// test variations of numeric input to be sure only strings that consist of one-or-more base-10 numerals (0-9) are accepted.
test('parseArabic: input bounds', async () => {
    await expect(parseArabic('0')).resolves.toBe(0)
    await expect(parseArabic('1')).resolves.toBe(1)
    await expect(parseArabic('2000')).resolves.toBe(2000)
    await expect(parseArabic('3999')).resolves.toBe(3999)
    await expect(parseArabic('4000')).resolves.toBe(4000)

    await expect(parseArabic('1e4')).rejects.toThrow(TypeError)
    await expect(parseArabic({ 'foo': 'bar' })).rejects.toThrow(TypeError)
    await expect(parseArabic('')).rejects.toThrow(TypeError)
    await expect(parseArabic('-1')).rejects.toThrow(TypeError)
    await expect(parseArabic('1.2')).rejects.toThrow(TypeError)
})

// test simple cases to exercise toRoman function and full handler
test('toRoman: check simple cases for 1, 2, 3', async () => {
    await expect(toRoman(1)).resolves.toBe('I')
    await expect(toRoman(2)).resolves.toBe('II')
    await expect(toRoman(3)).resolves.toBe('III')
})