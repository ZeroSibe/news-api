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
          expect(msg).toBe("Article Not Found");
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
});
