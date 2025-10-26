import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, afterEach } from "@jest/globals";
import { userCarsResponseModel } from "../../src/models/userCarsResponseModel.js";
import {
  createdCarResponseModel,
  errorResponseModel,
} from "../../src/models/createCarResponseModel.js";
import {
  createApiClient,
  createApiClientWithCookies,
} from "../../src/helpers/apiClient.js";
import { UserHelper } from "../../src/helpers/UserHelper.js";
import { CarHelper } from "../../src/helpers/CarHelper.js";

describe("Create user cars", () => {
  let clientWithCookies;

  afterEach(async () => {
    await UserHelper.deleteUserAfterTest(clientWithCookies);
    clientWithCookies = null;
  });

  test("Should return array with one car after adding one car", async () => {
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

    const userCarsResponse = await carsController.getUserCars();
    expect(userCarsResponse.status).toBe(200);
    const userCarsParsed = userCarsResponseModel.parse(userCarsResponse.data);
    expect(userCarsParsed.data).toHaveLength(1);
    expect(userCarsParsed.data[0]).toMatchObject({
      carBrandId: carData.carBrandId,
      carModelId: carData.carModelId,
      initialMileage: carData.mileage,
    });
  });

  test("Should return array with multiple cars after adding multiple cars", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const carsCount = 3;
    for (let i = 0; i < carsCount; i++) {
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
    }

    const userCarsResponse = await carsController.getUserCars();
    expect(userCarsResponse.status).toBe(200);
    const userCarsParsed = userCarsResponseModel.parse(userCarsResponse.data);
    expect(userCarsParsed.data).toHaveLength(carsCount);
  });

  test("Should return 400 when creating car with incorrect data", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const carData = { carBrandId: 999, carModelId: 999, mileage: 1000000 };
    const createCarResponse = await carsController.createCar(carData);
    expect(createCarResponse.status).toBe(400);
    errorResponseModel.parse(createCarResponse.data);
  });

  test("Should return 401 when creating car without authorization", async () => {
    const clientWithoutCookies = createApiClient();
    const carsController = new CarsController(clientWithoutCookies);

    const carData = await CarHelper.generateRandomCarData(clientWithoutCookies);
    const createCarResponse = await carsController.createCar(carData);
    expect(createCarResponse.status).toBe(401);
    errorResponseModel.parse(createCarResponse.data);
  });
});
