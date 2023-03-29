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

describe("/api/reviews/review_id/comments", () => {
  describe("METHOD: GET", () => {
    it("should have a get method that responds with status 200 and an array of comments for a review with most recent first", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(3);
          expect(comments).toBeSortedBy('created_at',{descending: true})
          comments.forEach((comment) => {
            expect(comment.review_id).toBe(2)
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String)
            });
          });
        });
    });
    it('should respond with a should respond with a 400 and an error message for invalid Review ID data types (anything but a number)', () => {
      return request(app)
      .get('/api/reviews/triangle/comments')
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid ID')
      })
    });
    it("should respond with status 404 and an error message for valid Review IDs that don't exist", () => {
      return request(app)
        .get("/api/reviews/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review ID 50 does not exist");
        });
    });
    it('should return a status 200 and empty comments array for a valid Review ID with no comments', () => {
      return request(app)
      .get('/api/reviews/8/comments')
      .expect(200)
      .then(({body})=>{
        expect(body.comments).toEqual([])
      })
    });
  });
  describe('METHOD: POST', () => {
    it('should have a post method that takes a comment object and returns the posted comment with status 201', () => {
      return request(app)
      .post('/api/reviews/3/comments')
      .send({username: 'bainesface', body: 'very nice stuff!'})
      .expect(201)
      .then(({body})=>{
        const {comment} = body
        expect(comment.comment_id).toBe(7)
        expect(comment.review_id).toBe(3)
        expect(comment.author).toBe('bainesface')
        expect(comment.body).toBe('very nice stuff!')
        expect(comment).toHaveProperty('created_at')
      })
    });it('should ignore extra comment properties and return a comment with status 201', () => {
      return request(app)
      .post('/api/reviews/3/comments')
      .send({username: 'bainesface', body:'very nice stuff!', size: 'medium'})
      .expect(201)
      .then(({body})=>{
        const {comment} = body
        expect(comment.comment_id).toBe(7)
        expect(comment.review_id).toBe(3)
        expect(comment.author).toBe('bainesface')
        expect(comment.body).toBe('very nice stuff!')
        expect(comment).toHaveProperty('created_at')
      })
    });
    it('should respond with a 404 status and an error message for all review IDs that don\'t exist', () => {
      return request(app)
      .post('/api/reviews/100/comments')
      .send({username: 'bainesface', body: 'very nice stuff!'})
      .expect(404)
      .then(({body})=>{
          expect(body.msg).toBe('Review ID does not exist')
      })
    });
    it('should respond with status 400 and an error message for invalid Review IDS', () => {
      return request(app)
      .post('/api/reviews/triangle/comments')
      .send({username: 'bainesface', body: 'very nice stuff!'})
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid ID')
      })
    });
    it('should respond with a 404 status and an error message for an invalid username', () => {
      return request(app)
      .post('/api/reviews/3/comments')
      .send({username: 'sugar', body: 'very nice stuff!'})
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid username')
      })
    });
    it('should respond with a 400 bad request for missing required comment properties', () => {
      return request(app)
      .post('/api/reviews/3/comments')
      .send({username: 'bainesface'})
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Incomplete body')
      })
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
