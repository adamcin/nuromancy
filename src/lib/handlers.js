const { convertIntegerString } = require("./convert");

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
exports.helloWorld = (req, res) => {
    res.send('Hello World!')
};

exports.romanNumeral = async (req, res) => {
    const qs = req.query
    if (qs !== undefined && qs.query !== undefined) {
        await convertIntegerString(qs.query).then(output => {
            res.status(200).send({'input': qs.query, 'output': output})
        }, error => {
            res.status(400).send({'error': error.message})
        })
    } else {
        res.status(400).send({'error': 'please specify a "query={integer}" parameter'})
    }
}