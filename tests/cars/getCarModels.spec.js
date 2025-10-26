import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, beforeAll } from "@jest/globals";
import {
  carModelsResponseModel,
  carModelByIdResponseModel,
  errorResponseModel,
} from "../../src/models/carModelsResponseModel.js";
import { faker } from "@faker-js/faker";
import { createApiClient } from "../../src/helpers/apiClient.js";

describe("Get car models", () => {
  const client = createApiClient();
  const carsController = new CarsController(client);

  let allModels;

  beforeAll(async () => {
    const carModelsResponse = await carsController.getCarModels();
    expect(carModelsResponse.status).toBe(200);
    const carModelsParsed = carModelsResponseModel.parse(
      carModelsResponse.data,
    );
    allModels = carModelsParsed.data;
  });

  test("Should return all car models", async () => {
    expect(allModels.length).toBeGreaterThan(0);
  });

  test("Should return car model by valid ID", async () => {
    const randomModel = faker.helpers.arrayElement(allModels);
    const randomModelId = randomModel.id;

    const carModelById = await carsController.getCarModelById(randomModelId);
    expect(carModelById.status).toBe(200);

    const carBrandParsed = carModelByIdResponseModel.parse(carModelById.data);
    expect(carBrandParsed.data).toEqual({
      id: randomModelId,
      carBrandId: randomModel.carBrandId,
      title: randomModel.title,
    });
  });

  test("Should return 404 for non-existent car model ID", async () => {
    const nonExistentId = faker.number.int({ min: 90000, max: 99999 });
    const carBrandsResponse = await carsController.getCarBrandById(
      nonExistentId,
    );
    expect(carBrandsResponse.status).toBe(404);
    errorResponseModel.parse(carBrandsResponse.data);
  });
});
