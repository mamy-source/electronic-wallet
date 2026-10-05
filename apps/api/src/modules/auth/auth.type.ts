export interface RegisterUserDto {
    email: string;
    password: string;
    fisrtName: string;
    lastName: string;
    bio?: string;
}

export interface LoginUserDto {
    email: string;
    password: string;
}