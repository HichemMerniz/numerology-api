export class UserRepository {
    private static users: { email: string; password: string }[] = [];
  
    static saveUser(email: string, hashedPassword: string) {
      this.users.push({ email, password: hashedPassword });
    }
  
    static findUserByEmail(email: string) {
      return this.users.find((user) => user.email === email);
    }
  }