export type AuthUser = {
    id: string;
    role: 'ADMIN' | 'CUSTOMER';
    phone: string;
    email?: string | null;
    name: string;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
