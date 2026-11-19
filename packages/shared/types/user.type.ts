export interface UpdatUserDto {
    email: string;
    password: string;
    profile: {
        firstName: string;
        lastName: string;
        bio?: string;
    };
}
