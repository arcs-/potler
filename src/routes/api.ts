import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import { register, registerSchema } from './user/register.post';
import { all } from './user/all.get';

const apiRouter = Router();

// ** Add UserRouter ** //
const userRouter = Router();
apiRouter.use('/users', userRouter);
userRouter.get('/', all);
userRouter.post('/register', processRequestBody(registerSchema), register);

export default apiRouter;
