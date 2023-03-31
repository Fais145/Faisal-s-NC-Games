const request = require("supertest");
const app  = require("../db/app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const { fetchApiInstructions } = require("../db/Models/api.models");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe('/api', () => {
  describe('METHOD: GET', () => {
    it('should respond with status 200 and a JSON describing all available endpoints', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body})=>{
        expect(body).toEqual({
          "GET /api": {
            "description": "serves up a json representation of all the available endpoints of the api"
          },
          "GET /api/categories": {
            "description": "serves an array of all categories",
            "queries": [],
            "exampleResponse": {
              "categories": [
                {
                  "description": "Players attempt to uncover each other's hidden role",
                  "slug": "Social deduction"
                }
              ]
            }
          },
          "GET /api/reviews": {
            "description": "serves an array of all reviews",
            "queries": ["category", "sort_by", "order"],
            "exampleResponse": {
              "reviews": [
                {
                  "review_id": 15,
                  "owner": "jessjelly",
                  "title": "Scrobble, no that's not a typo",
                  "designer": "Word Smith",
                  "review_img_url": "https://images.pexels.com/photos/8205368/pexels-photo-8205368.jpeg?w=700&h=700",
                  "category": "strategy",
                  "created_at": "2021-01-22T11:35:05.936Z",
                  "votes": 1,
                  "comment_count": "2"
                }
              ]
            }
          },
          "GET /api/reviews/:reviewID" : {
            "description": "serves a single review object with the given ID",
            "queries": [],
            "example response" : {
              "review" : {
                "title": "Culture a Love of Agriculture With Agricola",
                "review_id": 1,
                "review_body": "You could sum up Agricola with the simple phrase 'Farmyard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
                "votes": 1,
                "category": "strategy",
                "designer": "Uwe Rosenberg",
                "owner": "tickle122",
                "review_img_url": "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                "created_at": "2021-01-18T10:00:20.514Z",
                "comment_count": "3"
              }
            }
          },
          "GET /api/reviews/:reviewID/comments": {
            "description" : "serves an array of all comments for the review with the given ID",
            "queries" : [],
            "example response" : {
              "comments" : [
                {
                  "comment_id": 59,
                  "body": "Quis duis mollit ad enim deserunt.",
                  "review_id": 1,
                  "author": "jessjelly",
                  "votes": 3,
                  "created_at": "2021-03-27T19:48:58.110Z"
                }
              ]
            }
          },
          "GET /api/users" : {
            "description" : "serves an array of all our users",
            "queries" : [],
            "example response" : {
              "users" : [
                {
                  "username": "jessjelly",
                  "name": "Jess Jelly",
                  "avatar_url": "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141"
                }
              ]
            }
          },
          "PATCH /api/reviews/:reviewID" : {
            "description" : "allows you to input up or down votes for a review in the format {inc_votes: <NUMBER OF VOTES>} and serves the updated review",
            "queries" : [],
            "review before patch" : {
              "title": "One Night Ultimate Werewolf",
              "review_id": 4,
              "review_body": "We couldn't find the werewolf!",
              "votes": 5,
              "category": "hidden-roles",
              "designer": "Akihisa Okui",
              "owner": "happyamy2016",
              "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
              "created_at": "2021-01-18T10:01:41.251Z",
              "comment_count": "4"
              },
            "example input": "{inc_votes:2}",
            "example response" : {
              "review" : [
                {
                    "title": "One Night Ultimate Werewolf",
                    "review_id": 4,
                    "review_body": "We couldn't find the werewolf!",
                    "votes": 7,
                    "category": "hidden-roles",
                    "designer": "Akihisa Okui",
                    "owner": "happyamy2016",
                    "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
                    "created_at": "2021-01-18T10:01:41.251Z",
                    "comment_count": "4"
                }
              ]
            }
          },
          "POST /api/reviews/:reviewID/comments" : {
            "description" : "allows you to post a comment and serves the posted comment object",
            "queries" : [],
            "example input" : {
              username: 'weegembump', 
              body: "I didn't know dogs could play games"
            },
            "example response" : {
              "comment" : [
                {
                  "comment_id": 3,
                  "body": "I didn't know dogs could play games",
                  "review_id": 4,
                  "author": "weegembump",
                  "votes": 10,
                  "created_at": "2021-01-18T10:09:48.110Z"
                }
              ]
            }
          },
          "DELETE /api/comments/:commentID" : {
            "description" : "deletes the comment with given ID and serves nothing back",
            "queries" : [] 
          }
        })
      })
      
    });
  });
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
    it('should have a category query that responds with status 200 and reviews of games from that category ', () => {
      return request(app)
      .get('/api/reviews?category=dexterity')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews.length).toBe(1)
        expect(reviews).toBeInstanceOf(Array)
        reviews.forEach((review)=>{
          expect(review.category).toBe('dexterity')
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
          })
        })
      })
    });
    it('should return a 404 status and error message if category does not exist', () => {
      return request(app)
      .get('/api/reviews?category=shark123')
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('Category shark123 does not exist')
      })
    });
    it('should return status 200 and an empty array for a category that exists with no reviews', () => {
      return request(app)
      .get(`/api/reviews?category=children\'s+games`)
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toEqual([])
      })
    });
    it('should have a sort by query that responds with status 200 and an array of reviews sorted by specified column', () => {
      return request(app)
      .get('/api/reviews?sort_by=designer')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toHaveLength(13)
        expect(reviews).toBeInstanceOf(Array)
        expect(reviews).toBeSortedBy('designer',{descending:true})
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
    it('should have a sort by query that defauls to created_at', () => {
      return request(app)
      .get('/api/reviews?sort_by')
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
    it('should only accept sort by queries for columns in the reviews table', () => {
      return request(app)
      .get('/api/reviews?sort_by=5')
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid sort query')
      })
    });
    it('should have an order query that sorts by ascending or descending', () => {
      return request(app)
      .get('/api/reviews?order=asc')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at',{descending:false})
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
    it('should have an order query that defaults to descending', () => {
      return request(app)
      .get('/api/reviews?order')
      .expect(200)
      .then(({body})=>{
        const {reviews} = body
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy('created_at',{descending:true})
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
    it('should only accept asc or desc order queries', () => {
      return request(app)
      .get('/api/reviews?order=triangle')
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid order query')
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
          expect(reviewKeys.length).toBe(10);
          expect(review.review_id).toBe(3);
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("review_body");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("created_at");
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
    it('should include a comment count for the review', () => {
      return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        const reviewKeys = Object.values(review);
        expect(reviewKeys.length).toBe(10);
        expect(review.review_id).toBe(2);
        expect(review).toHaveProperty("title");
        expect(review).toHaveProperty("category");
        expect(review).toHaveProperty("designer");
        expect(review).toHaveProperty("owner");
        expect(review).toHaveProperty("review_body");
        expect(review).toHaveProperty("review_img_url");
        expect(review.comment_count).toBe('3')
      });
    });
  });
  
  describe('METHOD: PATCH', () => {
    it('should have a patch method for review votes that returns a status 200 and an updated review when given votes', () => {
      return request(app)
      .patch('/api/reviews/2')
      .send({inc_votes: 2})
      .expect(200)
      .then(({body})=>{
        const {review} = body
        expect(Object.keys(review).length).toBe(9)
        expect(review.review_id).toBe(2)
        expect(review.title).toBe('Jenga')
        expect(review.designer).toBe('Leslie Scott')
        expect(review.owner).toBe('philippaclaire9')
        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700')
        expect(review.review_body).toBe('Fiddly fun for all the family')
        expect(review.category).toBe('dexterity')
        expect(review.votes).toBe(7)
        expect(review).toHaveProperty('created_at')
      })
    });
    it('should ignore extra vote proprties and return status 200 with an updated review', () => {
      return request(app)
      .patch('/api/reviews/2')
      .send({inc_votes: 2,
            shape: 'square'})
      .expect(200)
      .then(({body})=>{
        const {review} = body
        expect(Object.keys(review).length).toBe(9)
        expect(review.review_id).toBe(2)
        expect(review.title).toBe('Jenga')
        expect(review.designer).toBe('Leslie Scott')
        expect(review.owner).toBe('philippaclaire9')
        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700')
        expect(review.review_body).toBe('Fiddly fun for all the family')
        expect(review.category).toBe('dexterity')
        expect(review.votes).toBe(7)
        expect(review).toHaveProperty('created_at')
      })
    });
    it('should have a review votes key that does not go below 0', () => {
      return request(app)
      .patch('/api/reviews/2')
      .send({inc_votes: -6})
      .expect(200)
      .then(({body})=>{
        const {review} = body
        expect(Object.keys(review).length).toBe(9)
        expect(review.review_id).toBe(2)
        expect(review.title).toBe('Jenga')
        expect(review.designer).toBe('Leslie Scott')
        expect(review.owner).toBe('philippaclaire9')
        expect(review.review_img_url).toBe('https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700')
        expect(review.review_body).toBe('Fiddly fun for all the family')
        expect(review.category).toBe('dexterity')
        expect(review.votes).toBe(0) //not -1!
        expect(review).toHaveProperty('created_at')
      })
    });
    it('should return a 404 not found and err message for valid review IDs that don\'t exist', () => {
      return request(app)
      .patch('/api/reviews/46')
      .send({inc_votes: 2})
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('Review ID does not exist')
      })
    });
    it('should respond with status 400 and an error message for invalid Review IDS', () => {
      return request(app)
      .patch('/api/reviews/cool')
      .send({inc_votes: 3})
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid ID')
      })
    });
    it('should respond with status 400 and an error message for no vote property', () => {
      return request(app)
      .patch('/api/reviews/2')
      .send({price: 1, pet: 'cat'})
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('No votes found')
      })
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

describe('/api/comments/:commentID', () => {
  describe('METHOD: DELETE', () => {
    it('should delete the relevant comment and respond with status 204 and no content', () => {
      return request(app)
      .delete('/api/comments/1')
      .expect(204)
    });
    it('should respond with status 404 and an error message for valid comment IDs that don\'t exist', () => {
      return request(app)
      .delete('/api/comments/42')
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('Comment ID 42 does not exist')
      })
    });
    it('should respond with a 400 and an error message for invalid comment ID data types (anything but a number)', () => {
      return request(app)
      .delete('/api/comments/sword')
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Invalid ID')
      })
    });
  });
});

describe('/api/users', () => {
  describe('METHOD: GET', () => {
    it('should have a get method that returns status code 200 and an array of users', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(({body})=>{
        const {users} = body
        expect(users).toHaveLength(4)
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
      })
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
