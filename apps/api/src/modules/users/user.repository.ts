import { prisma } from '../../config/prisma.js';

export interface CreateUserRepo {
    email: string;
    password: string;

}

export class UserRepository {

    //find by email
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                profile: true,
            },
        });
    }

    //find by Id
    async findById(id: string) {
        return await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                profile: true,
            },
        });
    }

    //create user
    async createUser(data: CreateUserRepo) {
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
            },
            include: {
                profile: true,
            },
        });
    }

    //create with profile
    async createWithProfile(data: CreateUserRepo & {
        firstName: string;
        lastName: string;
        bio?: string;
    },
    ){
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                profile: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        ...(data.bio !== undefined && {
                            bio: data.bio,
                          }),
                    },
                },
            },
            include: {
                profile: true,
            },
        });
    }
}
