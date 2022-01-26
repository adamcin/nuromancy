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

const { MAX_INPUT, MIN_INPUT, parseInput, expectWithinRange } = require("../convert")

test('expect all inputs between MIN_INPUT and MAX_INPUT to return parsed versions of themselves', async () => {
    const inputs = Array.from({ length: MAX_INPUT - MIN_INPUT + 1 }, (v, k) => { return MIN_INPUT + k })
    
    const outputPromises = inputs
        .map(value => value.toString(10))
        .map(input => parseInput(input).then(integer => expectWithinRange(integer))) // string => Promise<number>()

    const outputs = []
    for (var i = 0; i < outputPromises.length; i++) {
        const result = await outputPromises[i].catch(() => 0)
        outputs.push(result)
    }
    
    expect(outputs).toEqual(expect.arrayContaining(inputs))
})