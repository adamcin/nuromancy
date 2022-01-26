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
const MIN_INPUT = 1
exports.MIN_INPUT = MIN_INPUT

const MAX_INPUT = 3999
exports.MAX_INPUT = MAX_INPUT

/**
 * Parse a string into a pure arabic number. Do not allow non-string args, and do not allow empty
 * strings or strings containing any non-digit characters.
 * 
 * @param {string} input 
 * @returns Promise<number>
 */
const parseArabic = async (input) => {
    if (!input.match(/^[0-9]+$/)) {
        throw new TypeError(`input ${input} must be an integer`)
    } else {
        return parseInt(input, 10)
    }
}
exports.parseArabic = parseArabic

/**
 * Filters number input to enforce integers between MIN_INPUT and MAX_INPUT. Allowed input is returned,
 * Rejected input throws a RangeError.
 * 
 * @param {number} input an integer
 * @returns Promise<number>
 */
const expectWithinRange = async (input) => {
    if (typeof input != 'number' || isNaN(input)) {
        throw new TypeError(`input ${input} must be an integer`)
    } else if (input < MIN_INPUT || input > MAX_INPUT) {
        throw new RangeError(`input ${input} must be between ${MIN_INPUT} and ${MAX_INPUT}`)
    } else {
        return input
    }
}
exports.expectWithinRange = expectWithinRange

/**
 * Converts a number to a string containing the equivalent roman numeral.
 * 
 * According to https://en.wikipedia.org/wiki/Roman_numerals, ...
 * 
 * @param {number} arabic 
 * @returns Promise<string>
 */
const toRoman = async (arabic) => {
    var result = ''
    for (var i = 0; i < arabic; i++) {
        result = result + 'I'
    }
    return result
}
exports.toRoman = toRoman

/**
 * Perform conversion of a single string-encoded Arabic number into a single string-encoded Roman number.
 * 
 * @param {string} input 
 * @returns Promise<string>
 * @throws TypeError | RangeError on illegal input
 */
exports.convertArabicToRoman = async (input) => {
    return parseArabic(input)
        .then(integer => expectWithinRange(integer))
        .then(arabic => toRoman(arabic))
}