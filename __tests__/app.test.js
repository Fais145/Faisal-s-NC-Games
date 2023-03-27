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
              description: expect.any(String)
            });
          });
        });
    });
  });
});

describe('/api/reviews', () => {
  describe('METHOD: GET', () => {
    it('should have a get method that responds with status 200 and a single review based on ID',()=>{
      return request(app)
      .get('/api/reviews/3')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toBeInstanceOf(Object)
        const reviewKeys = Object.values(reviews)
        expect(reviewKeys.length).toBe(9)
        expect(reviews.review_id).toBe(3)
        expect(reviews).toHaveProperty('title')
        expect(reviews).toHaveProperty('category')
        expect(reviews).toHaveProperty('designer')
        expect(reviews).toHaveProperty('owner')
        expect(reviews).toHaveProperty('review_body')
        expect(reviews).toHaveProperty('review_img_url')
        
          });
        });
      it('should respond with a 404 for get requests for review IDs that don\'t exist with msg: \'Invalid ID', () => {
        return request(app)
        .get('/api/reviews/50')
        .expect(404)
        .then(({body})=>{
          expect(body.msg).toBe('No review found for review ID 50')
        })
      });
      it('should respond with a 400 and an error message for invalid ID data types (anything but a number)', () => {
        return request(app)
        .get('/api/reviews/banana')
        .expect(400)
        .then(({body})=>{
          expect(body.msg).toBe('Invalid ID')
        })
      });
      })
    })
 

describe('/*', () => {
    it("should handle ALL typos and invalid URLs with a 404 and custom error message ",()=>{
    return request(app)
      .get("/api/katagories")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid file path!");
    })
})
})
