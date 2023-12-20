
import { expressjwt } from "express-jwt";
import env from '@src/env'
import { sign } from 'jsonwebtoken';

export const authMiddleware = expressjwt({
	secret: env.TOKEN_SECRET,
	algorithms: ["HS256"]
})

export function generateToken(user: {
	id: number;
	email: string;
}) {
	return sign(
		{ id: user.id, email: user.email },
		env.TOKEN_SECRET,
		{ expiresIn: '24h' },
	)
}