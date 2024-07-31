const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("App", () => {
  describe("/api/bad-path", () => {
    test("GET:404 - returns appropriate status and error message for non-existent route", () => {
      return request(app)
        .get("/api/invalid-route")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path Not Found");
        });
    });
  });
  describe("/api", () => {
    describe("GET /api", () => {
      test("GET:200 responds with an object containing all the available endpoints on this API", () => {
        const expectedEndpoints = require("../endpoints.json", "utf-8");
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body: { endpoints } }) => {
            expect(endpoints).toEqual(expectedEndpoints);
          });
      });
    });
  });
  describe("/api/topics", () => {
    describe("GET /api/topics", () => {
      test("GET:200 responds with an array of topic objects with the correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
              expect(topic).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String),
              });
            });
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET /api/articles", () => {
      test("GET:200 responds with an array of article objects with the correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13);
            articles.forEach((article) => {
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              });
              expect(article).not.toHaveProperty("body");
            });
          });
      });
      test("GET:200 responds with articles sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      test("GET:200 responds with the correct comment_count values", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[6].article_id).toBe(1);
            expect(articles[6].comment_count).toBe(11);
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET:200 responds with an article object with the correct properties", () => {
      const articleId = 1;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: articleId,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: convertTimestampToDate(1594329060000),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("GET:404 returns appropriate status and error message when given a valid but non-existent id", () => {
      const articleId = 9999;
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article 9999 Not Found");
        });
    });
    test("GET:400 returns appropriate status and error message when given an invalid id", () => {
      const articleId = "invalid";
      return request(app)
        .get(`/api/articles/${articleId}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Article ID");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("GET:200 responds with an array of comments with the correct properties for the given article_id", () => {
      return request(app)
        .get(`/api/articles/9/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(2);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 9,
            });
          });
        });
    });
    test("GET:404 returns appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get(`/api/articles/9999/comments`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article 9999 Not Found");
        });
    });
    test("GET:400 returns appropriate status and error message when given an invalid id", () => {
      return request(app)
        .get(`/api/articles/invalid/comments`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Article ID");
        });
    });
    test("GET:200 returns an empty array when given a valid article_id that exists but has no associated comments", () => {
      return request(app)
        .get(`/api/articles/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
        });
    });
    test("GET:200 responds with comments sorted by date in descending order", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
      const newComment = {
        username: "lurker",
        body: "posting a 201 comment",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 19,
            votes: 0,
            created_at: expect.any(String),
            author: "lurker",
            body: "posting a 201 comment",
            article_id: 3,
          });
        });
    });
    test("POST:400 responds with an appropriate status and error message when given an invalid id", () => {
      const newComment = {
        username: "lurker",
        body: "posting a comment",
      };
      return request(app)
        .post("/api/articles/invalid/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Article ID");
        });
    });
    test("POST:400 responds with an appropriate status and error message when given a bad comment - missing required body field", () => {
      const badComment = {
        username: "lurker",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(badComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing required field in comment post");
        });
    });
    test("POST:400 responds with an appropriate status and error message when given a bad comment - missing required username field", () => {
      const badComment = {
        body: "400 no username",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(badComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid username");
        });
    });
    test("POST:400 responds with an appropriate status and error message when given a bad comment - invalid username", () => {
      const badComment = {
        username: 123,
        body: "400 invalid username",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(badComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid username");
        });
    });
    test("POST:404 responds with an appropriate status and error message when given a valid comment but non-existent id", () => {
      const newComment = {
        username: "lurker",
        body: "posting a comment",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article 999 Not Found");
        });
    });
    test("POST:404 responds with an appropriate status and error message when given a valid comment but non-existent username", () => {
      const newComment = {
        username: "iDontExist",
        body: "posting a 404 username comment",
      };
      return request(app)
        .post("/api/articles/9/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User iDontExist Not Found");
        });
    });
  });
});
