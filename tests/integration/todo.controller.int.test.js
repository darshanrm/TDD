const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");
const mongoose = require("mongoose");
const mongodb = require("../../db_url");

const endpointUrl = "/todos/";

describe(endpointUrl, () => {
  beforeAll(async () => {
    await mongoose.connect(mongodb.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  let firstTodo, newTodoId;
  const testData = { title: "Integration test for PUT", done: true };
  const nonExistingTodoId = "61bb0dff1659385e798b1e31";

  it("GET /todos", async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(400);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  it("GET /todos/:id", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it("GET /todos/:id id doesn't exist", async () => {
    const response = await request(app).get(endpointUrl + nonExistingTodoId);
    expect(response.statusCode).toBe(404);
  });

  it("POST /todos", async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });

  it("should return error 500 on malformed data with POST /todos", async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing done property" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });

  it("PUT /todos", async () => {
    const response = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  it("DELETE /todos", async () => {
    const response = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });

  it("DELETE /todos id doesn't exist", async () => {
    const response = await request(app)
      .delete(endpointUrl + nonExistingTodoId)
      .send();
    expect(response.statusCode).toBe(404);
  });
});
