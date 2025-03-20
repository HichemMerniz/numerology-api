import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import config from "../config/config";

interface User {
  id: string;
  email: string;
  password: string;
}

interface JWTPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static async register(email: string, password: string) {
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.saveUser(email, hashedPassword);
    return { message: "User registered successfully" };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findUserByEmail(email) as User;
    if (!user) throw new Error("Invalid credentials");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid credentials");

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, config.jwtSecret);
    return { token };
  }
}   