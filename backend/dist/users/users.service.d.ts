import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        name: string;
        phone: string;
        address: string | null;
        email: string | null;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        name: string;
        phone: string;
        address: string | null;
        email: string | null;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
