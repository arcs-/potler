import { AuthPayload } from '@src/services/auth';
import type { Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import type { ZodType, ZodTypeDef } from 'zod';
import type { TypedRequestBody } from 'zod-express-middleware';

declare global {

	export type ApiRequest<TBody extends ZodType<any, ZodTypeDef, any> = void> =
		TypedRequestBody<TBody> & {
			auth?: JwtPayload & AuthPayload
		};

	export interface ApiResponse extends Response { }

}