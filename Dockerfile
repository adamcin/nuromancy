# Copyright 2022 Mark Adamcin. All rights reserved.
# 
# Licensed under the Apache License, Version 2.0 (the "License"); 
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# be consistent with install instructions in readme
FROM node:12-alpine as npm-build

ADD . /app

WORKDIR /app

RUN npm install

# run tests as part of image build
RUN npm test

RUN npm run build

# run worker.js
FROM node:12-alpine

# express is expected to listen on 8080
EXPOSE 8080

# note that AppInsights logging is supported when this ENV is populated
ENV APPINSIGHTS_INSTRUMENTATIONKEY ""

WORKDIR /app

COPY --from=npm-build /app/dist/worker.js /app/worker.js

# docker image should only be used to run this cmd
ENTRYPOINT [ "node", "worker.js" ]