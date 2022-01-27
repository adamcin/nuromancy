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
const { convertArabicToRoman, convertArabicToRomanRange } = require("./convert");

exports.indexHtml = (req, res) => {
    res.send(`
    <body>
    <form name=single action=/romannumeral method=get>
        <label for=query>Query</label>
        <input id=query name=query>
        <button type=submit>Submit</button>
    </form>
    <form name=range action=/romannumeral method=get>
        <label for=min>Min</label>
        <input id=min name=min>
        <label for=max>Max</label>
        <input id=max name=max>
        <button type=submit>Submit</button>
    </form>
    </body>
    `)
};

exports.romanNumeral = async (req, res) => {
    const qs = req.query
    if (qs !== undefined && qs.query !== undefined) {
        await convertArabicToRoman(qs.query).then(output => {
            res.status(200).send({ 'input': qs.query, 'output': output })
        }, error => {
            res.status(400).send({ 'error': error.message })
        })
    } else if (qs !== undefined && qs.min !== undefined && qs.max !== undefined) {
        await convertArabicToRomanRange(qs.min, qs.max).then(conversions => {
            res.status(200).send({ 'conversions': conversions.map(({ arabic, roman }) => { 
                return { 'input': arabic, 'output': roman } 
            }) })
        }, error => {
            res.status(400).send({ 'error': error.message })
        })
    } else {
        res.status(400).send({ 'error': 'please specify a "query={integer}" parameter, or both "min={integer}" and "max={integer}" parameters for a range conversion' })
    }
}