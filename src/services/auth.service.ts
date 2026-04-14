import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';
import { config } from '../config/index.js';
import { AppError } from '../middleware/error.js';
import { HttpStatusCode, ErrorMessages } from '../config/constants.js';
import {
  RegisterInput,
  LoginInput,
  JwtPayload,
  AuthenticatedUser,
} from '../types/auth.js';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: AuthenticatedUser; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError(ErrorMessages.EMAIL_ALREADY_EXISTS, HttpStatusCode.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
      },
    });

    const token = this.generateToken(user);

    return {
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<{ user: AuthenticatedUser; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError(ErrorMessages.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorMessages.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
    }

    const token = this.generateToken(user);

    return {
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string): Promise<AuthenticatedUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string }
  ): Promise<AuthenticatedUser> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError(ErrorMessages.INVALID_CREDENTIALS, HttpStatusCode.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  private generateToken(user: { id: string; email: string; role: string }): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
  }
}

export const authService = new AuthService();
