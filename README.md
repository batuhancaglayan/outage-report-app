# outage-report-app

## Introduction

``outage-report-app`` developed for identify and report outage which are related with site devices. This readme includes little summary of application.

## Purpose

- Get all outages from the GET /outages endpoint
- Get information from the GET /site-info/{siteId} endpoint for the site with the ID norwich-pear-tree
- Filters out any outages that began before 2022-01-01T00:00:00.000Z or don't have an ID that is in the list of devices in the site information
- For the remaining outages, it should attach the display name of the device in the site information to each appropriate outage
- Report identified outages to POST /site-outages/{siteId}
- Bonus: "``The API will occasionally return 500 status codes. Can you implement a solution that is resilient to this scenario?``" A small code base retry logic added for report outages phase. (If we consider this application to be started by a trigger (like a queue message), retry logic can be designed with queue retry policies.) 

Typescript was used while developing the project. 

## Dependencies

There is a list of used dependencies below. Development dependencies did not listed.

- axios => used in project for http communication
- npmlog => used for logging

## Usage

### Github Action

Using with build-test workflow, you can run tests.

Help with identify-outages workflow, you can execute project.

`Note:` If you want to run tests or execute project via Github action, i will add user as contributer to repo, please share related Github user with me.

### Local

#### Clone repo

```bash
git clone https://github.com/batuhancaglayan/outage-report-app.git
```

#### Install

```bash
npm install
```

#### Run

Apikey and service endpoint value are not hardcoded. You need to set required environment variables before running project.

- export OUTAGE_SERVICE_URL=<SERVICE_URL>
- export OUTAGE_SERVICE_API_KEY=<YOUR_API_KEY>

```bash
npm start
```

## Author

**Batuhan Çağlayan**

* LinkedIn: [@batuhan-çağlayan-b2975b9a(https://linkedin.com/in/batuhan-%C3%A7a%C4%9Flayan-b2975b9a)