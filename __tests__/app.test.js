const request = require("supertest");
const { app } = require("../db/app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  describe("METHOD: GET", () => {
    it("should have a get method that responds with status 200 and a categories array", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("METHOD: GET", () => {
    it("should have a get method that responds with status 200 and an array of reviews", () => {
      return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at',{descending: true})
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            review_id: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      })
    });
  });
});

describe("/api/reviews/review_id", () => {
  describe("METHOD: GET", () => {
    it("should have a get method that responds with status 200 and a single review based on ID", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          const { review } = body;
          expect(review).toBeInstanceOf(Object);
          const reviewKeys = Object.values(review);
          expect(reviewKeys.length).toBe(9);
          expect(review.review_id).toBe(3);
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("review_body");
          expect(review).toHaveProperty("review_img_url");
        });
    });
    it("should respond with a 404 for get requests for review IDs that don't exist with msg: 'Invalid ID", () => {
      return request(app)
        .get("/api/reviews/50")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No review found for review ID 50");
        });
    });
    it("should respond with a 400 and an error message for invalid ID data types (anything but a number)", () => {
      return request(app)
        .get("/api/reviews/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid ID");
        });
    });
  });
});

describe("/*", () => {
  it("should handle ALL typos and invalid URLs with a 404 and custom error message ", () => {
    return request(app)
      .get("/api/katagories")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid file path!");
      });
  });
});
