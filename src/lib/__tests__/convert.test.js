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

const { MAX_INPUT, MIN_INPUT, parseArabic, expectWithinRange } = require("../convert")

test('expectWithinRange: expect all inputs between MIN_INPUT and MAX_INPUT to return parsed versions of themselves', async () => {
    const inputs = Array.from({ length: MAX_INPUT - MIN_INPUT + 1 }, (v, k) => { return MIN_INPUT + k })

    const outputPromises = inputs
        .map(value => value.toString(10))
        .map(input => parseArabic(input).then(integer => expectWithinRange(integer))) // string => Promise<number>()

    const outputs = []
    for (var i = 0; i < outputPromises.length; i++) {
        const result = await outputPromises[i].catch(() => 0)
        outputs.push(result)
    }
    
    expect(outputs).toEqual(expect.arrayContaining(inputs))
})

// test variations of numeric input to be sure only strings that consist of one-or-more base-10 numerals (0-9) are accepted.
test('parseArabic: input bounds', async () => {
    await expect(parseArabic('0')).resolves.toBe(0)
    await expect(parseArabic('1')).resolves.toBe(1)
    await expect(parseArabic('2000')).resolves.toBe(2000)
    await expect(parseArabic('3999')).resolves.toBe(3999)
    await expect(parseArabic('4000')).resolves.toBe(4000)

    await expect(parseArabic('1e4')).rejects.toThrow(TypeError)
    await expect(parseArabic({'foo':'bar'})).rejects.toThrow(TypeError)
    await expect(parseArabic('')).rejects.toThrow(TypeError)
    await expect(parseArabic('-1')).rejects.toThrow(TypeError)
    await expect(parseArabic('1.2')).rejects.toThrow(TypeError)
})