import { faker } from "@faker-js/faker";
import { AuthController } from "../../src/controllers/AuthController.js";

export class UserHelper {
  static generateRandomPassword() {
    const min = 8;
    const max = 15;
    const length = faker.number.int({ min, max });
    let password =
      faker.string.numeric(1) +
      faker.string.alpha({ length: 1, casing: "upper" }) +
      faker.string.alpha({ length: 1, casing: "lower" });

    password += faker.internet.password({
      length: length - password.length,
      memorable: false,
    });

    return password;
  }

  static generateRandomUserData() {
    const password = this.generateRandomPassword();
    const timestamp = Date.now();
    return {
      name: faker.person.firstName().replace(/[^a-zA-Z]/g, ""),
      lastName: faker.person.lastName().replace(/[^a-zA-Z]/g, ""),
      email: `user_${timestamp}@${faker.internet.domainName()}`,
      password: password,
      repeatPassword: password,
    };
  }

  static async signUp(client) {
    const authController = new AuthController(client);
    const userData = UserHelper.generateRandomUserData();
    const response = await authController.signUp(userData);

    if (response.status !== 201) {
      throw new Error(
        `Signup failed: ${response.status} ${JSON.stringify(response.data)}`,
      );
    }
    return userData;
  }

  static async signIn(client, userData) {
    const authController = new AuthController(client);
    const response = await authController.signIn({
      email: userData.email,
      password: userData.password,
      remember: false,
    });
    if (response.status !== 200) {
      throw new Error(
        `Signin failed: ${response.status} ${JSON.stringify(response.data)}`,
      );
    }
  }

  static async signInWithNewUser(client) {
    const userData = await this.signUp(client);
    await this.signIn(client, userData);
  }

  static async deleteUserAfterTest(client) {
    if (client) {
      const authController = new AuthController(client);
      try {
        await authController.deleteUser();
      } catch (error) {
        console.log("Failed to delete user:", error.message);
      }
    }
  }
}
