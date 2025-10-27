import { BaseController } from "./BaseController.js";

export class CarsController extends BaseController {
  getCarBrands() {
    return this.client.get("/cars/brands");
  }

  getCarBrandById(id) {
    return this.client.get(`/cars/brands/${id}`);
  }

  getCarModels() {
    return this.client.get("/cars/models");
  }

  getCarModelById(id) {
    return this.client.get(`/cars/models/${id}`);
  }

  getUserCars() {
    return this.client.get("/cars");
  }

  getUserCarById(id) {
    return this.client.get(`/cars/${id}`);
  }

  createCar(carData) {
    return this.client.post("/cars", carData);
  }

  updateCar(id, carData) {
    return this.client.put(`/cars/${id}`, carData);
  }

  deleteCar(id) {
    return this.client.delete(`/cars/${id}`);
  }
}
