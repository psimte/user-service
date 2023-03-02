const { default: expect } = require("expect");
const request = require("supertest");
const userapp = require("./app");

describe("FoodApp Users API", () => {
  it("POST /api/registration ==> Should successfully register user -> 200 OK", () => {
    const mockUser = {
      _id: 122,
      name: "Test User",
      email: "tetst11@test.com",
      mobile: "8545454554",
      password: "testtest",
      role: "user",
      location: "Delhi",
    };

    return request(userapp)
      .post("/api/registration")
      .send(mockUser)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
  });

  it("GET /api/users ==> Should return list of register users -> 200 OK", () => {
    return request(userapp)
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });
  });

  it("GET /api/users/:id ==> Should return a user for a given email if registered -> 200 OK", () => {
    return request(userapp)
      .get("/api/users/lalsimte223@test.com")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });
  });

  it("POST /api/login ==> Should  login successfull with correct credentials-> 200", () => {
    return request(userapp)
      .post("/api/login")
      .send({
        email: "tetst11@test.com",
        password: "testtest",
      })
      .expect(200)

      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });
  });

  it("POST /api/login ==> Should not login with wrong credential -> 400", () => {
    return request(userapp)
      .post("/api/login")
      .send({
        email: "a@test.com",
        password: "testtest",
      })
      .expect(401)

      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            success: false,
          })
        );
      });
  });

  it("GET /users ==> Should return error for wrong user id -> 404", () => {
    return request(userapp).get("/users/23").expect(404);
  });
});

it("POST /api/login ==> Should not login with wrong credential -> 401", () => {
  return request(userapp)
    .post("/api/login")
    .send({
      email: "lalsimte23@test.com",
      password: "wrongpassword",
    })
    .expect(401)

    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          success: false,
        })
      );
    });
});
