import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';

function normalizePhone(phone: string) {
  return phone.trim().replace(/[\s-]/g, '');
}

function sanitizeUser(user: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  password?: string | null;
}) {
  const { password: _password, ...rest } = user;
  return rest;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const phone = normalizePhone(dto.phone);
    const email = dto.email?.trim().toLowerCase() || undefined;

    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (existingPhone) {
      throw new ConflictException('Phone number already registered');
    }

    if (email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        phone,
        email: email ?? null,
        password,
        address: dto.address?.trim() || null,
        role: 'CUSTOMER',
      },
    });

    return this.tokenResponse(user);
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.phone) {
      throw new UnauthorizedException('Email or phone is required');
    }

    const user = dto.email
      ? await this.prisma.user.findUnique({
          where: { email: dto.email.trim().toLowerCase() },
        })
      : await this.prisma.user.findUnique({
          where: { phone: normalizePhone(dto.phone as string) },
        });

    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.tokenResponse(user);
  }

  private tokenResponse(user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    role: string;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
    password?: string | null;
  }) {
    const accessToken = this.jwt.sign({
      sub: user.id,
      role: user.role,
    });
    return {
      accessToken,
      user: sanitizeUser(user),
    };
  }
}
