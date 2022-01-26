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

const parseInput = async (input) => {
    if (!input.match(/^[0-9]*$/)) {
        throw new TypeError(`input ${input} must be an integer`)
    } else {
        return parseInt(input, 10)
    }
}
exports.parseInput = parseInput

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

exports.convertIntegerString = async (input) => {
    return parseInput(input)
        .then(integer => expectWithinRange(integer))
}