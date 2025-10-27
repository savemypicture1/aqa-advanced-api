import { CarsController } from "../../src/controllers/CarsController.js";
import { describe, expect, test, afterEach } from "@jest/globals";
import {
  userCarsResponseModel,
  errorResponseModel,
} from "../../src/models/userCarsResponseModel.js";
import { createdCarResponseModel } from "../../src/models/createCarResponseModel.js";
import {
  createApiClient,
  createApiClientWithCookies,
} from "../../src/helpers/apiClient.js";
import { UserHelper } from "../../src/helpers/UserHelper.js";
import { CarHelper } from "../../src/helpers/CarHelper.js";
import { faker } from "@faker-js/faker";

describe("Get user cars", () => {
  let clientWithCookies;

  afterEach(async () => {
    await UserHelper.deleteUserAfterTest(clientWithCookies);
    clientWithCookies = null;
  });

  test("Should return empty array for new user without cars", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const userCarsResponse = await carsController.getUserCars();
    expect(userCarsResponse.status).toBe(200);
    const userCarsParsed = userCarsResponseModel.parse(userCarsResponse.data);
    expect(userCarsParsed.data).toHaveLength(0);
  });

  test("Should return array with one car after adding a car", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const carData = await CarHelper.generateRandomCarData(clientWithCookies);
    const createCarResponse = await carsController.createCar(carData);
    expect(createCarResponse.status).toBe(201);

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

  test("Should return car by ID after adding a car", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const carData = await CarHelper.generateRandomCarData(clientWithCookies);
    const createCarResponse = await carsController.createCar(carData);
    expect(createCarResponse.status).toBe(201);
    const createCarParsed = createdCarResponseModel.parse(
      createCarResponse.data,
    );
    const userCarsResponse = await carsController.getUserCarById(
      createCarParsed.data.id,
    );
    expect(userCarsResponse.status).toBe(200);

    const userCarsParsed = createdCarResponseModel.parse(userCarsResponse.data);
    expect(userCarsParsed.data).toMatchObject({
      id: createCarParsed.data.id,
      carBrandId: createCarParsed.data.carBrandId,
      carModelId: createCarParsed.data.carModelId,
      initialMileage: createCarParsed.data.mileage,
    });
  });

  test("Should return 404 for non-existent car ID", async () => {
    clientWithCookies = createApiClientWithCookies();
    const carsController = new CarsController(clientWithCookies);

    await UserHelper.signInWithNewUser(clientWithCookies);

    const nonExistentId = faker.number.int({ min: 90000, max: 99999 });
    const userCarsResponse = await carsController.getUserCarById(nonExistentId);
    expect(userCarsResponse.status).toBe(404);
    errorResponseModel.parse(userCarsResponse.data);
  });

  test("Should return 401 for unauthorized user", async () => {
    const clientWithoutCookies = createApiClient();
    const carsController = new CarsController(clientWithoutCookies);

    const userCarsResponse = await carsController.getUserCars();
    expect(userCarsResponse.status).toBe(401);
    errorResponseModel.parse(userCarsResponse.data);
  });
});
