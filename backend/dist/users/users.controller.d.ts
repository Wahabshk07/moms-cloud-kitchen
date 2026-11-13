import { type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UsersService } from './users.service.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: AuthUser): Promise<{
        name: string;
        phone: string;
        address: string | null;
        email: string | null;
        id: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: AuthUser, dto: UpdateProfileDto): Promise<{
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
