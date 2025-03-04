# News API

## Hosted Site

[NEWS API](https://news-api-apvv.onrender.com/api/)

_Please Note it may take a while to load_

---

- [About NEWS API](#about-news-api)
- [Prerequisites](#prerequisites)
- [Project Set Up](#project-set-up)

---

## About NEWS API

NEWS API is a RESTful API built using [Express.js](https://expressjs.com/).

NEWS API that has been built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture, such as [NEWS](https://github.com/ZeroSibe/news).

The database is PostgreSQL, and will interact with it using [node-postgres](https://node-postgres.com/).

The API is hosted using Render and the database is hosted using [Supabase](http://supabase.com/).

## Prerequisites

To use this project, you need to install the following on your system:

- Node.js v20.9.0 or greater
- PostgreSQL v14.10 or greater

## Project Set Up

To set up this project locally

1. Clone the repository:

```

git clone https://github.com/ZeroSibe/news-api.git

```

2. Navigate to the project directory:

```
cd news-api

```

3. Install all the dependencies:

```
npm install

```

4. Set up the enviroment variables:

- create files `.env.test` and `.env.development` in the root directory of the project

- into each file write:

```
PGDATABASE = database_name_here

```

_for reference, for `.env.development`, you would write `PGDATABASE=nc_n` where nc_n is the database name for development and nc_n_test is the databse name for test enviroment_

- if access to your local database requires a password, include it in your files:

```

PGPASSWORD=your-password-here

```

_you can omit this line, if password is not required. Check if you need this before you add it in_

5. Set up the local database:

- Create the databases:

```
npm run setup-dbs

```

- Seed the development database:

```

npm run seed

```

6. Run Server

- To allow the server to listen to incoming requests:

```

npm run start

```

_This will allow you to make requests to the API via `localhost:9090/api`. You can use tools like Insomnia to send JSON requests_

7. Close Server

- To terminate the node instance, type CTRL + C in your termal,

8. Run Tests

```
npm t

```

- alternatively, you can run specific test files

```

npm t <test file name>

```

_The test suite uses the test database to check all endpoints work as intended_

---

### Husky

To ensure we are not committing broken code, this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package that allows us to set up and maintain these scripts. This project makes use of a pre-commit hook. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail, then the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project, as well as creating your own custom hooks.

---

### To Do (Future Enhancements)

20. ADVANCED: GET /api/articles (pagination) - completed, branch 20_articles_pagination

21. ADVANCED: GET /api/articles/:article_id/comments (pagination)

22. ADVANCED: POST /api/topics

23. ADVANCED: DELETE /api/articles/:article_id

24. Conclusion - review
