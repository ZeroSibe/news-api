### Back End JS > Northcoders News API

## Northcoders News API

### Overview

### Prerequisite:

Read notes:

1. Git Branching
2. Advanced Error Handling
3. API Hosting
4. Intro to CICD

### Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

Your database will be PostgreSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

---

Today is a bit different! Get started by cloning (not forking) [this GitHub repo](https://github.com/northcoders/be-nc-news).

---

### Git Branching and Pull Requests

You will be working on each ticket on a new **branch**.

To create and switch to a new git branch, use the command:

```
git checkout -b <new branch name>

```

This will create a branch and move over to that branch. (Omit the `-b` flag if you wish to switch to an already existing branch).

You should name the branch after the task number and feature that it implements, e.g. `2-get-topics` or `4-get-article-by-id`.

When pushing the branch to GitHub, ensure that you make reference to the branch you are pushing to on the remote. For example:

```
git push origin 2-get-topics

```

Once a pull request been accepted, be sure to switch back to the main branch and pull down the updated changes.

```
git checkout main

git pull origin main
```

You can tidy up your local branches once they have been pulled into main by deleting them:

```
git branch -D <local branch>

```

**Make sure that you always checkout to main before creating a new branch.**

### Husky

To ensure we are not committing broken code, this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package that allows us to set up and maintain these scripts. This project makes use of a pre-commit hook. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail, then the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project, as well as creating your own custom hooks.

### Setup

Setting up your enviroment variables:
at the root directory, you create two files:

1. `.env.test`
2. `.env.development`

Within each of the file add the respective database names to connect to locally. For reference look inside `.env-example`.

### Outline of Core Tasks

To view each challenge in detail, you can click the navigation buttons on the left-hand side of the screen. You do not need to have completed a challenge to view the next one.

If you would like to see a shorthand reminder for all the core tasks, they are as follows:

`GET /api/topics`

- responds with a list of topics

`GET /api`

- responds with a list of available endpoints

`GET /api/articles/:article_id`

- responds with a single article by article_id

`GET /api/articles`

- responds with a list of articles

`GET /api/articles/:article_id/comments`

- responds with a list of comments by article_id

`POST /api/articles/:article_id/comments`

- add a comment by article_id

`PATCH /api/articles/:article_id`

- updates an article by article_id

`DELETE /api/comments/:comment_id`

- deletes a comment by comment_id

`GET /api/users`

- responds with a list of users

`GET /api/articles (queries)`

- allows articles to be filtered and sorted

`GET /api/articles/:article_id (comment count)`

- adds a comment count to the response when retrieving a single article

---

### Tasks

Make your way through the following sections. You'll get access to the next section when you submit one.

1. Project Setup

2. CORE: GET /api/topics

3. CORE: GET /api

4. CORE: GET /api/articles/:article_id

5. CORE: GET /api/articles

6. CORE: GET /api/articles/:article_id/comments

7. CORE: POST /api/articles/:article_id/comments

8. CORE: PATCH /api/articles/:article_id

9. CORE: DELETE /api/comments/:comment_id

10. CORE: GET /api/users

11. CORE: GET /api/articles (topic query)

12. CORE: GET /api/articles/:article_id (comment_count)

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
