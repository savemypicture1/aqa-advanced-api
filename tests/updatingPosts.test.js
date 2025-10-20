import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { API_BASE_URL } from "../src/constants/api.js";

describe("Updating Posts API", () => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    validateStatus: () => true,
  });

  test("PUT /posts/1 updates a post and returns updated object", async () => {
    const requestData = {
      id: 1,
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await apiClient.put("/posts/1", requestData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(requestData);
  });

  test("PATCH /posts/1 partially updates a post and returns updated object", async () => {
    const requestData = {
      title: "updated title",
    };
    const response = await apiClient.patch("/posts/1", requestData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: expect.any(Number),
      title: "updated title",
      body: expect.any(String),
      userId: expect.any(Number),
    });
  });
});
