var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength, ValidateIf, } from 'class-validator';
function emptyToUndefined({ value }) {
    if (value === null || value === undefined)
        return undefined;
    if (typeof value === 'string' && value.trim() === '')
        return undefined;
    return typeof value === 'string' ? value.trim() : value;
}
export class RegisterDto {
    name;
    phone;
    email;
    password;
    address;
}
__decorate([
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    IsString(),
    MinLength(10),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    Transform(emptyToUndefined),
    IsEmail(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], RegisterDto.prototype, "address", void 0);
export class LoginDto {
    email;
    phone;
    password;
}
__decorate([
    ValidateIf((o) => !o.phone),
    IsEmail(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    ValidateIf((o) => !o.email),
    IsString(),
    __metadata("design:type", String)
], LoginDto.prototype, "phone", void 0);
__decorate([
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map