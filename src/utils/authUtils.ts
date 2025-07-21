import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const verifyPassword = (plainText: string, hashed: string) => {
    return bcrypt.compareSync(plainText, hashed);
};

export const hashPassword = (plainText: string) => {
    return bcrypt.hashSync(plainText, 10);
};

export function authMiddleware(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}