import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { API_BASE_URL } from "../src/constants/api.js";

describe("Updating Posts API", () => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    validateStatus: () => true,
  });
  const postId = 1;

  test(`PUT /posts/${postId} updates a post and returns updated object`, async () => {
    const requestData = {
      id: postId,
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await apiClient.put(`/posts/${postId}`, requestData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(requestData);
  });

  test(`PATCH /posts/${postId} partially updates a post and returns updated object`, async () => {
    const updatedTitle = "updated title";
    const requestData = {
      title: updatedTitle,
    };
    const response = await apiClient.patch(`/posts/${postId}`, requestData);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: postId,
      title: updatedTitle,
      body: expect.any(String),
      userId: expect.any(Number),
    });
  });
});
