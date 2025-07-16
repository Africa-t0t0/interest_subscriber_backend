import dotenv from 'dotenv';

dotenv.config();

export const OPENAI_API_KEY: string = String(process.env.OPENAI_API_KEY);
export const DEEPSEEK_API_KEY: string = String(process.env.DEEPSEEK_API_KEY);
export const PORT: number = Number(process.env.PORT);
export const DB_URI = String(process.env.DATABASE_URI);
export const DB_PROCESS_URI = String(process.env.DB_PROCESS_URI);