import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, afterEach } from "@jest/globals";
import {
  createdCarResponseModel,
  errorResponseModel,
} from "../../src/models/createCarResponseModel.js";
import { createApiClientWithCookies } from "../../src/helpers/apiClient.js";
import { UserHelper } from "../../src/helpers/UserHelper.js";
import { CarHelper } from "../../src/helpers/CarHelper.js";
import { deleteCarResponseModel } from "../../src/models/deleteCarResponseModel.js";

describe("Delete user cars", () => {
  let clientWithCookies;

  afterEach(async () => {
    await UserHelper.deleteUserAfterTest(clientWithCookies);
    clientWithCookies = null;
  });

  test("Should delete car and return deleted car ID", async () => {
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
      initialMileage: carData.mileage,
    });

    const deleteCarResponse = await carsController.deleteCar(
      createCarParsed.data.id,
    );
    expect(deleteCarResponse.status).toBe(200);
    const deleteCarParsed = deleteCarResponseModel.parse(
      deleteCarResponse.data,
    );
    expect(deleteCarParsed.data).toEqual({
      carId: createCarParsed.data.id,
    });
  });

  test("Should return 404 when deleting non-existent car", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const deleteCarResponse = await carsController.deleteCar("999");
    expect(deleteCarResponse.status).toBe(404);
    errorResponseModel.parse(deleteCarResponse.data);
  });
});
