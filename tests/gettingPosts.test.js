import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { API_BASE_URL } from "../src/constants/api.js";

describe("Getting Posts API", () => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    validateStatus: () => true,
  });
  const postId = 1;

  test(`GET /post/${postId} returns status 200 and a post object`, async () => {
    const response = await apiClient.get(`/posts/${postId}`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: postId,
      title: expect.any(String),
      body: expect.any(String),
      userId: expect.any(Number),
    });
  });

  test("GET /posts returns status 200 and an array of posts", async () => {
    const response = await apiClient.get("/posts");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    response.data.forEach((post) => {
      expect(post).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
        userId: expect.any(Number),
      });
    });
  });
});
