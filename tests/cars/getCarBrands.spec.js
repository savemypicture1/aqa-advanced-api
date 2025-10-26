import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, beforeAll } from "@jest/globals";
import {
  carBrandsResponseModel,
  carBrandByIdResponseModel,
  errorResponseModel,
} from "../../src/models/carBrandsResponseModel.js";
import { faker } from "@faker-js/faker";
import { createApiClient } from "../../src/helpers/apiClient.js";

describe("Get car brands", () => {
  const client = createApiClient();
  const carsController = new CarsController(client);

  let allBrands;

  beforeAll(async () => {
    const carBrandsResponse = await carsController.getCarBrands();
    expect(carBrandsResponse.status).toBe(200);
    const carBrandsParsed = carBrandsResponseModel.parse(
      carBrandsResponse.data,
    );
    allBrands = carBrandsParsed.data;
  });

  test("Should be able to get Car brands", async () => {
    expect(allBrands.length).toBeGreaterThan(0);
  });

  test("Should be able to get Car brand by ID", async () => {
    const randomBrand = faker.helpers.arrayElement(allBrands);
    const randomBrandId = randomBrand.id;

    const carBrandById = await carsController.getCarBrandById(randomBrandId);
    expect(carBrandById.status).toBe(200);

    const carBrandParsed = carBrandByIdResponseModel.parse(carBrandById.data);
    expect(carBrandParsed.data).toEqual({
      id: randomBrandId,
      title: randomBrand.title,
      logoFilename: randomBrand.logoFilename,
    });
  });

  test("Should return 404 for non-existent car brand", async () => {
    const nonExistentId = faker.number.int({ min: 10000, max: 99999 });
    const carBrandsResponse = await carsController.getCarBrandById(
      nonExistentId,
    );
    expect(carBrandsResponse.status).toBe(404);
    errorResponseModel.parse(carBrandsResponse.data);
  });
});
