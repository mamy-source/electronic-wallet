import argon2 from 'argon2';

import env from '../config/env.js';

const getArgon2Config = () =>{
    type EnvName = 'development' | 'production' | 'test';
    const envName = env.nodeEnv as EnvName;

    const configs: Record<EnvName, {
        type: number;
        memoryCost: number;
        timeCost: number;
        parallelism: number;
        hashLength: number;
        saltLength: number;
    }> = {
        development: {
            type: argon2.argon2id,
            memoryCost: 2 ** 16, // 64 MB
            timeCost: 3,
            parallelism: 1,
            hashLength: 32,
            saltLength: 16,
        },
        production: {
            type: argon2.argon2id,
            memoryCost: 2 ** 18, // 256 MB
            timeCost: 4,
            parallelism: 2,
            hashLength: 32,
            saltLength: 16,
        },
        test: {
            type: argon2.argon2id,
            memoryCost: 2 ** 15, // 32 MB
            timeCost: 2,
            parallelism: 1,
            hashLength: 32,
            saltLength: 16,
        }
        
    };

    return configs[envName] || configs.development;
};

// Add the server side pepper to the password before hashing
const pepperPassword = (password: string): string => {
    return `${password}${env.pepper}`;
};

// Hash a password using Argon2 with the specified configuration
const hashPassword = async (password: string): Promise<string> => {
    try {
        const config = getArgon2Config();
        const pepperedPassword = pepperPassword(password);

        const hash = await argon2.hash(pepperedPassword, config);
        return hash;
        
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
        
    }
}

// Verify a password against a hash using Argon2 with the specified configuration
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const pepperedPassword = pepperPassword(password);
        const isValid =  await argon2.verify(hash, pepperedPassword);
        return isValid;
    }
    catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Failed to verify password');

        return false;
    }
}

export default {
    hashPassword,
    verifyPassword,
}
