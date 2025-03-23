"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    static saveUser(email, hashedPassword) {
        this.users.push({ email, password: hashedPassword });
    }
    static findUserByEmail(email) {
        return this.users.find((user) => user.email === email);
    }
}
exports.UserRepository = UserRepository;
UserRepository.users = [];
