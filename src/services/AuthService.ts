import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;

    await user.hashPassword();
    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
      const user = await this.userRepository.findOne({
        where: { id: decoded.id }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
} 