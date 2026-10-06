export interface RegisterUserDto {
    email: string;
    password: string;
    profile: {
        firstName: string;
        lastName: string;
        bio?: string;
    };
}

export interface LoginUserDto {
    email: string;
    password: string;
}