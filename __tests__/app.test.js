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
            expect(articles).toHaveLength(13);
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
    describe("?sort_by", () => {
      test("GET:200 sorts articles by votes descending", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", {
              descending: true,
            });
          });
      });
      test("GET:200 sorts articles by title descending", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("title", {
              descending: true,
            });
          });
      });
      test("GET:200 sorts articles by topic descending", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("topic", {
              descending: true,
            });
          });
      });
      test("GET:200 sorts articles by author descending", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", {
              descending: true,
            });
          });
      });
      test("GET:200 sorts articles by comment_count descending", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      test("GET:400 responds with an appropriate status and error message when given an invalid column", () => {
        return request(app)
          .get("/api/articles?sort_by=article_img_url")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid sort by query");
          });
      });
    });
    describe("?order", () => {
      test("GET:200 sends an array of all articles by date order ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13);
            expect(articles).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      test("GET:200 sends an array of all articles by valid sort_by and order query", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13);
            expect(articles[0].title).toBe("A");
            expect(articles).toBeSortedBy("title", {
              descending: false,
            });
          });
      });
      test("GET:400 sends an appropriate status and error message for an invalid order query", () => {
        return request(app)
          .get("/api/articles?order=invalid")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid order query");
          });
      });
    });
    describe("?topic", () => {
      test("GET:200 sends an array of articles by their valid topic query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      test("GET:400 sends an appropriate status and error message for an invalid topic query", () => {
        return request(app)
          .get("/api/articles?topic=123")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid topic query");
          });
      });
      test("GET:404 responds with an appropriate status and error message when given a valid but non-existent topic query", () => {
        return request(app)
          .get("/api/articles?topic=apple")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No Articles Found");
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
    test("PATCH:200 sends updated article back to client - increment vote", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch(`/api/articles/1`)
        .send(body)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: convertTimestampToDate(1594329060000),
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:200 sends updated article back to client - decrement vote", () => {
      const body = {
        inc_votes: -100,
      };
      return request(app)
        .patch(`/api/articles/1`)
        .send(body)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: convertTimestampToDate(1594329060000),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:404 responds with appropriate status and error message when given a valid but non-existent id", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch(`/api/articles/9999`)
        .send(body)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article 9999 Not Found");
        });
    });
    test("PATCH:400 responds with appropriate status and error message when given an invalid id", () => {
      const body = {
        inc_votes: 1,
      };
      return request(app)
        .patch(`/api/articles/invalid`)
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Article ID");
        });
    });
    test("PATCH:400 responds with appropriate status and error message when given invalid inc_votes type", () => {
      const body = {
        inc_votes: "invalid type",
      };
      return request(app)
        .patch(`/api/articles/1`)
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("inc_votes must be a number");
        });
    });
    test("PATCH:400 responds with appropriate status and error message when given an invalid/missing property", () => {
      const body = {
        title: "missing property",
      };
      return request(app)
        .patch(`/api/articles/1`)
        .send(body)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("inc_votes must be a number");
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
  describe("/api/comments/:comment_id", () => {
    test("DELETE:204 deletes the specified comment and sends no body back", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    test("DELETE:404 responds with an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment Not Found");
        });
    });
    test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Comment ID");
        });
    });
  });
  describe("/api/users", () => {
    test("GET:200 responds with an array of user objects with the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
