import bcrypt from "bcrypt";


export const verifyPassword = (plainText: string, hashed: string) => {
    return bcrypt.compareSync(plainText, hashed);
};

export const hashPassword = (plainText: string) => {
    return bcrypt.hashSync(plainText, 10);
};
