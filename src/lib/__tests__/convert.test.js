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

// test bounds of thousands place
test('toRoman: check thousands', async () => {
    await expect(toRoman(0)).resolves.toBe('')
    await expect(toRoman(1000)).resolves.toBe('M')
    await expect(toRoman(2000)).resolves.toBe('MM')
    await expect(toRoman(3000)).resolves.toBe('MMM')
    await expect(toRoman(4000)).resolves.toBe('')
})

// test bounds of hundreds place
test('toRoman: check hundreds', async () => {
    await expect(toRoman(0)).resolves.toBe('')
    await expect(toRoman(100)).resolves.toBe('C')
    await expect(toRoman(200)).resolves.toBe('CC')
    await expect(toRoman(300)).resolves.toBe('CCC')
    await expect(toRoman(400)).resolves.toBe('CD')
    await expect(toRoman(500)).resolves.toBe('D')
    await expect(toRoman(600)).resolves.toBe('DC')
    await expect(toRoman(700)).resolves.toBe('DCC')
    await expect(toRoman(800)).resolves.toBe('DCCC')
    await expect(toRoman(900)).resolves.toBe('CM')
    await expect(toRoman(1000)).resolves.toBe('M')
})

// test bounds of tens place
test('toRoman: check tens', async () => {
    await expect(toRoman(0)).resolves.toBe('')
    await expect(toRoman(10)).resolves.toBe('X')
    await expect(toRoman(20)).resolves.toBe('XX')
    await expect(toRoman(30)).resolves.toBe('XXX')
    await expect(toRoman(40)).resolves.toBe('XL')
    await expect(toRoman(50)).resolves.toBe('L')
    await expect(toRoman(60)).resolves.toBe('LX')
    await expect(toRoman(70)).resolves.toBe('LXX')
    await expect(toRoman(80)).resolves.toBe('LXXX')
    await expect(toRoman(90)).resolves.toBe('XC')
    await expect(toRoman(100)).resolves.toBe('C')
})

// test bounds of ones place
test('toRoman: check ones', async () => {
    await expect(toRoman(0)).resolves.toBe('')
    await expect(toRoman(1)).resolves.toBe('I')
    await expect(toRoman(2)).resolves.toBe('II')
    await expect(toRoman(3)).resolves.toBe('III')
    await expect(toRoman(4)).resolves.toBe('IV')
    await expect(toRoman(5)).resolves.toBe('V')
    await expect(toRoman(6)).resolves.toBe('VI')
    await expect(toRoman(7)).resolves.toBe('VII')
    await expect(toRoman(8)).resolves.toBe('VIII')
    await expect(toRoman(9)).resolves.toBe('IX')
    await expect(toRoman(10)).resolves.toBe('X')
})

// test Wikipedia examples and some other complex examples of note
test('toRoman: spot check complex numbers', async () => {
    await expect(toRoman(39)).resolves.toBe('XXXIX')
    await expect(toRoman(246)).resolves.toBe('CCXLVI')
    await expect(toRoman(789)).resolves.toBe('DCCLXXXIX')
    await expect(toRoman(2421)).resolves.toBe('MMCDXXI')
    // test for place omissions
    await expect(toRoman(160)).resolves.toBe('CLX')
    await expect(toRoman(207)).resolves.toBe('CCVII')
    await expect(toRoman(1009)).resolves.toBe('MIX')
    await expect(toRoman(1066)).resolves.toBe('MLXVI')
    // mmm...
    await expect(toRoman(1983)).resolves.toBe('MCMLXXXIII')
    await expect(toRoman(2022)).resolves.toBe('MMXXII')
    await expect(toRoman(MAX_INPUT)).resolves.toBe('MMMCMXCIX')
    await expect(toRoman(1776)).resolves.toBe('MDCCLXXVI')
    await expect(toRoman(1918)).resolves.toBe('MCMXVIII')
    await expect(toRoman(1954)).resolves.toBe('MCMLIV')
})