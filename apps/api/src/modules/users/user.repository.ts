import { create } from 'domain';
import { prisma } from '../../config/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';


const userSelect = {
    id: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    profile: {
        select: {
            firstName: true,
            lastName: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
        },
    },
}

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
        profile: {
            firstName: string;
            lastName: string;
            bio?: string;
        }
    },
    ){
        return await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                profile: {
                    create: {
                        firstName: data.profile.firstName,
                        lastName: data.profile.lastName,
                        ...(data.profile.bio !== undefined && {
                            bio: data.profile.bio,
                          }),
                    },
                },
            },
            include: {
                profile: true,
            },
        });
    }

    //find all users
    async findAll() {
        return await prisma.user.findMany({
            select: userSelect,
            orderBy: {
                createdAt: 'desc',
            }
        });
    }

    //update user
    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: {
                id,
            },
            data,
            select: userSelect,
        });
    }

    //delete user
    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: {
                id,
            },
            select: userSelect,
        });
    }
}
