import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignInDto, SignUpDto } from './auth.dto';
import { hashPassword, comparePassword } from './auth.utils';
import { signJwt } from './jwt.utils';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  async signUp(payload: SignUpDto) {
    const { username, email, password } = payload;

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return user;
  }

  async signIn(payload: SignInDto) {
    const { email, password } = payload;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatched = await comparePassword(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = signJwt({ userId: user.id }, process.env.JWT_SECRET!, '15m');
    const refreshToken = signJwt({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, '7d');

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
