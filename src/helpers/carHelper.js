import { faker } from "@faker-js/faker";
import { CarsController } from "../controllers/CarsController.js";
import { carModelsResponseModel } from "../models/carModelsResponseModel.js";

export class CarHelper {
  static async generateRandomCarData(client) {
    const carsController = new CarsController(client);
    const carModelsResponse = await carsController.getCarModels();
    const carModelsParsed = carModelsResponseModel.parse(
      carModelsResponse.data,
    );
    const randomModel = faker.helpers.arrayElement(carModelsParsed.data);

    return {
      carBrandId: randomModel.carBrandId,
      carModelId: randomModel.id,
      mileage: faker.number.int({ min: 0, max: 200000 }),
    };
  }
}
