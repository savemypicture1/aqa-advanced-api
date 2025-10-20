import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { API_BASE_URL } from "../src/constants/api.js";

describe("Creating Posts API", () => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    validateStatus: () => true,
  });

  test("POST /posts creates a post and returns created object", async () => {
    const requestData = {
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await apiClient.post("/posts", requestData);
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      ...requestData,
      id: expect.any(Number),
    });
  });
});
