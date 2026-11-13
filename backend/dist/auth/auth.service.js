var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
function normalizePhone(phone) {
    return phone.trim().replace(/[\s-]/g, '');
}
function sanitizeUser(user) {
    const { password: _password, ...rest } = user;
    return rest;
}
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
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
    async login(dto) {
        if (!dto.email && !dto.phone) {
            throw new UnauthorizedException('Email or phone is required');
        }
        const user = dto.email
            ? await this.prisma.user.findUnique({
                where: { email: dto.email.trim().toLowerCase() },
            })
            : await this.prisma.user.findUnique({
                where: { phone: normalizePhone(dto.phone) },
            });
        if (!user?.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new UnauthorizedException('Invalid credentials');
        return this.tokenResponse(user);
    }
    tokenResponse(user) {
        const accessToken = this.jwt.sign({
            sub: user.id,
            role: user.role,
        });
        return {
            accessToken,
            user: sanitizeUser(user),
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map