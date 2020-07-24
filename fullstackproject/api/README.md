# Full Stack JavaScript Techdegree v2 - REST API Project

In order to check out this project, I am assuming you first have npm installed.  In order to get started, navigate to your preferred terminal application, and the correct folder where these files reside.  In the terminal, type "npm install".  This should install all project dependencies.
Next, again in the terminal, type "npm run seed".  This will initialize the REST API, in order to start with fresh information.  Lastly, type "npm start". This should start the server, and connect with the database.

In order to evaluate this project, it's best to use a program like Postman, which allows you to use SQL verbs to GET, POST, PUT, and DELETE as needed.  There is a file entitled "RESTAPI.postman_collection.json", which includes all necessary SQL processes.

In order to access the REST API, it is best to use a program similar to DB Browser.  The REST API should be in the root of the project folder, and can be accessed to confirm how the project works.

The app can also be accessed by going to your browser and going to "http://localhost:5000/", though not much is actually posted there for this project.










****Everything below was my project instructions.

## Overview of the Provided Project Files

We've supplied the following files for you to use: 

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
