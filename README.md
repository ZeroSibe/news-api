#### Back End JS > News API (remastered)

# News API

### Link to hosted version

Hosted version (coming soon!)

### Summary

An API that has been built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

The database is PostgreSQL, and will interact with it using [node-postgres](https://node-postgres.com/).

---

### Getting Started

To run this project locally, you can clone this project and run in your own enviroment.

1. Clone this repo in your own dev enviroment

- In your terminal `git clone https://github.com/ZeroSibe/news-api.git `

2. In your terminal run `npm install` - to install all the dependencies.
3. Run Tests

- you can run all the test suites, run the script `npm run test` in your terminal to check
- alternatively, you can run specific test files `npm t <test file name>`

4. This project requires two `.env` files

- create your enviroment variables in a `.env.test` and `.env.development` file in the root directory of this project

- into each file add the database name `PGDATABASE = <database_name_here>`

- For reference look inside `.env-example`.

5. To create and seed your local databases, run the scripts `npm run setup-dbs` in your terminal, and then run `npm run seed`

6. To run the server with the development data, in your terminal run `npm run start`

- you'll be listening on port `9090`

---

### Husky

To ensure we are not committing broken code, this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package that allows us to set up and maintain these scripts. This project makes use of a pre-commit hook. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail, then the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project, as well as creating your own custom hooks.

---

### Minimum Requirements

Recommend using Node v20.9.0 and Postgres v8.7.3

### To Do

13. CORE: Host application

14. CORE: Complete README

15. ADVANCED: GET /api/articles (sorting queries)

16. ADVANCED: Express Routers

17. ADVANCED: GET /api/users/:username

18. ADVANCED: PATCH /api/comments/:comment_id

19. ADVANCED: POST /api/articles

20. ADVANCED: GET /api/articles (pagination)

21. ADVANCED: GET /api/articles/:article_id/comments (pagination)

22. ADVANCED: POST /api/topics

23. ADVANCED: DELETE /api/articles/:article_id

24. Conclusion
