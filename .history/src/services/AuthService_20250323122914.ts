import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import config from "../config/config";
import { FileStorage } from "../utils/fileStorage";
import { i18n } from "../utils/i18n";

interface UserData {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

interface JWTPayload {
  userId: string;
  email: string;
}

export class AuthService {
  static async register(email: string, password: string, locale: string = 'en') {
    const existingUser = await FileStorage.findUserByEmail(email);
    if (existingUser) throw new Error(i18n.translate("user_exists", locale));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    const userId = await FileStorage.saveUser(userData);
    return { message: i18n.translate("user_registered", locale), userId };
  }

  static async login(email: string, password: string, locale: string = 'en') {
    const user = await FileStorage.findUserByEmail(email) as UserData | null;
    if (!user) throw new Error(i18n.translate("invalid_credentials", locale));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error(i18n.translate("invalid_credentials", locale));

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email
    };

    const options: SignOptions = {
        expiresIn: `${config.tokenExpiration}d`
    };

    const token = jwt.sign(
      payload,
      config.jwtSecret as Secret,
      options
    );

    return { token };
  }
}   