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
 * According to https://en.wikipedia.org/wiki/Roman_numerals, the following table
 * represents standard notation of Roman numbers within the range, mapped to decimal "places"
 * of 1000's, 100s, 10s, and 1s. When the decimal place value is 0 in an input Arabic number,
 * we can omit any symbol from that mapping column in the output Roman number.
 * 
 * ---------------------------------
 * |   | 1000 | 100  | 10   | 1    |
 * ---------------------------------
 * | 1 | M    | C    | X    | I    |
 * | 2 | MM   | CC   | XX   | II   |
 * | 3 | MMM  | CCC  | XXX  | III  |
 * | 4 |      | CD   | XL   | IV   |
 * | 5 |      | D    | L    | V    |
 * | 6 |      | DC   | LX   | VI   |
 * | 7 |      | DCC  | LXX  | VII  |
 * | 8 |      | DCCC | LXXX | VIII |
 * | 9 |      | CM   | XC   | IX   |
 * ---------------------------------
 * 
 * Encoding each decimal place for a given Arabic number according to the relevant column in
 * the mapping table presents an optimal approach to handling the subtractive notation without
 * resorting to some kind of decision tree. We will div and mod the Arabic number to isolate the 
 * input value relevant to each column, and for the 100s, 10s, and 1s, we'll perform a 
 * generalized lookup using a switch statement on ([1-9]) that assembles the appropriate result 
 * from each of a different set of three characters for each column (CDM, XLC, IVX).
 * 
 * For the 1000s place, it is simpler to just return '', 'M', 'MM', or 'MMM' for the result of 
 * (input / 1000).
 * 
 * @param {number} arabic 
 * @returns Promise<string>
 */
const toRoman = async (arabic) => {
    const lookupThousands = (digit) => {
        switch (digit) {
            case 3: return 'MMM'
            case 2: return 'MM'
            case 1: return 'M'
            default: return ''
        }
    }

    const lookupPlace = (digit, one, five, ten) => {
        switch (digit) {
            case 9: return `${one}${ten}`
            case 8: return `${five}${one}${one}${one}`
            case 7: return `${five}${one}${one}`
            case 6: return `${five}${one}`
            case 5: return `${five}`
            case 4: return `${one}${five}`
            case 3: return `${one}${one}${one}`
            case 2: return `${one}${one}`
            case 1: return `${one}`
            default: return ''
        }
    }

    return lookupThousands(Math.floor(arabic / 1000))
        + lookupPlace(Math.floor((arabic % 1000) / 100), 'C', 'D', 'M')
        + lookupPlace(Math.floor((arabic % 100) / 10), 'X', 'L', 'C')
        + lookupPlace(arabic % 10, 'I', 'V', 'X')
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