
import { expressjwt } from "express-jwt";
import { sign } from 'jsonwebtoken';
import env from '@src/services/env'

export interface AuthPayload {
	id: number;
	email: string;
	admin: boolean;
}

export const authMiddleware = expressjwt({
	secret: env.TOKEN_SECRET,
	algorithms: ["HS256"]
})

export function generateToken(user: {
	id: number;
	email: string;
}) {
	return sign(
		{
			id: user.id,
			email: user.email,
			admin: user.id === 1
		},
		env.TOKEN_SECRET,
		{ expiresIn: '24h' },
	)
}