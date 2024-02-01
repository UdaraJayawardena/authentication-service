# Authentication Service

## Description
This service handles user authentication and authorization within the BrideFund IT ecosystem.

This process is activated for funders first and BridgeFund loan management later.
In this process all request validate users and there permission levels.

```
authorization
authentication
```
## Understanding the File Structure

```
Loan-Management
│
└───config
│   │   index.js
│   │   env
│   │      │  sample
│   │   config.js
│   │   database.js
│
└───test
│   │ index.js
│
└───src
│   │ index.js
│   │ helper.js
│   │ router.js
│   │
│   └───v1
│       │ handlers
│       │   │ index.js
│       │   │ errors.js
│       │   │ response.js
│       │
│       │ index.js
│       │ router.js
│       │
│
│ server.js
│ package.json
│ README.md