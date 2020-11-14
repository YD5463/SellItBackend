const { User } = require("../../models/users");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const faker = require("faker");
const { maxConsecutiveFailsByUsername } = require("../../utilities/limiter");

describe("users and auth routes", () => {
  let server;
  const authUrl = "/api/auth";
  const usersUrl = "/api/users";
  const users = [];
  faker.seed(2);
  const generateUser = () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName(),
      phone_number: faker.phone.phoneNumber("##########"),
    };
    return user;
  };
  const createUser = async () => {
    const user = generateUser();
    users.push(user);
    return { res: await request(server).post(usersUrl).send(user), user };
  };
  const create_and_login = async () => {
    const { user } = await createUser();
    return request(server)
      .post(authUrl)
      .send({ email: user.email, password: user.password });
  };

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
  });
  afterAll(async () => {
    console.log("im here");
    users.forEach(async (user) => await User.remove(user));
  });

  it("should block me after n auth fails times", async () => {
    const { user } = await createUser();
    for (let i = 0; i < maxConsecutiveFailsByUsername + 1; i++) {
      const res = await request(server)
        .post(authUrl)
        .send({ email: user.email, password: user.password + "123" });
      expect(res.status).toBe(400);
    }
    const res = await request(server)
      .post(authUrl)
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(429);
  });

  it("should return 400 if user not exists or password is worng", async () => {
    let res = await request(server)
      .post(authUrl)
      .send({ email: "notexists@gmail.com", password: "some pass" });
    expect(res.status).toBe(400);
    res = await create_and_login();
    expect(res.status).toBe(200);
    const { user } = await createUser();
    res = await request(server)
      .post(authUrl)
      .send({ email: user.email, password: user.password + "123" });
    expect(res.status).toBe(400);
  });

  it("should return 200 and valid token if user is exists", async () => {
    const { res, user } = await createUser();
    expect(res.status).toBe(201);

    const response = await request(server)
      .post(authUrl)
      .send({ email: user.email, password: user.password });

    expect(response.status).toBe(200);
  });
});
