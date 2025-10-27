import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, afterEach } from "@jest/globals";
import {
  createdCarResponseModel,
  errorResponseModel,
} from "../../src/models/createCarResponseModel.js";
import { createApiClientWithCookies } from "../../src/helpers/apiClient.js";
import { UserHelper } from "../../src/helpers/UserHelper.js";
import { CarHelper } from "../../src/helpers/CarHelper.js";
import { faker } from "@faker-js/faker";

describe("Update user cars", () => {
  let clientWithCookies;

  afterEach(async () => {
    await UserHelper.deleteUserAfterTest(clientWithCookies);
    clientWithCookies = null;
  });

  test("Should update car and return updated data", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const carData = await CarHelper.generateRandomCarData(clientWithCookies);
    const createCarResponse = await carsController.createCar(carData);
    expect(createCarResponse.status).toBe(201);
    const createCarParsed = createdCarResponseModel.parse(
      createCarResponse.data,
    );
    expect(createCarParsed.data).toMatchObject({
      carBrandId: carData.carBrandId,
      carModelId: carData.carModelId,
      mileage: carData.mileage,
    });

    const newCarData = await CarHelper.generateRandomCarData(clientWithCookies);
    newCarData.mileage = carData.mileage + 1; // Ensure mileage is greater than initial mileage
    const updateCarResponse = await carsController.updateCar(
      createCarParsed.data.id,
      newCarData,
    );
    expect(updateCarResponse.status).toBe(200);
    const updateCarParsed = createdCarResponseModel.parse(
      updateCarResponse.data,
    );
    expect(updateCarParsed.data).toMatchObject({
      carBrandId: newCarData.carBrandId,
      carModelId: newCarData.carModelId,
      mileage: newCarData.mileage,
    });
  });

  test("Should return 404 when updating non-existent car", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const newCarData = await CarHelper.generateRandomCarData(clientWithCookies);
    const nonExistentId = faker.number.int({ min: 90000, max: 99999 });
    const updateCarResponse = await carsController.updateCar(
      nonExistentId,
      newCarData,
    );
    expect(updateCarResponse.status).toBe(404);
    errorResponseModel.parse(updateCarResponse.data);
  });
});
