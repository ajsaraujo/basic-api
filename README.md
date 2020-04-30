## basic-api 

basic-api is an API made in Node.js with Express and MongoDB. It implements a user CRUD, besides endpoints for authentication and password recovery. Unit and integration tests were written for all endpoints, middlewares, and helper methods. I intended to create a generalist and cohesive application that may serve as a foundation for bigger apps.

### Installation and usage

1. Install [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you didn't yet.
2. You will need a connection with MongoDB, be it [local](https://zellwk.com/blog/local-mongodb/) or [remote](https://www.mongodb.com/cloud/atlas).
3. Clone the project using ``git clone https://github.com/ajsaraujo/basic-api.git``. 
4. On the project's source folder, run the command ``npm install`` to install all dependencies.
5. Also on the source folder, create a `.env` file and add all fields that are in `.env.example`, filling them as you wish. 
6. Remember to allow access in the email you provided, so the application can send emails. If your email provider is Gmail, you can allow access from third-party apps [here](https://myaccount.google.com/).
7. To run the app, execute the command ``node server.js`` on the `src/` folder. To run the tests, use `npm run test`. 
