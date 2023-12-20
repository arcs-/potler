import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import { register, registerSchema } from './user/register.post';
import { all } from './user/all.get';
import { add, addSchema } from './recipe/add.post';
import { suggestions } from './recipe/suggestions.get';
import { login, loginSchema } from './user/login.post';
import { authMiddleware } from '@src/services/auth';

const apiRouter = Router();
apiRouter.use(authMiddleware.unless({
	path: ["/api/users/login", "/api/users/register"]
}))

// ** UserRouter ** //
const userRouter = Router();
apiRouter.use('/users', userRouter);
userRouter.get('/', all);
userRouter.post('/login', processRequestBody(loginSchema), login);
userRouter.post('/register', processRequestBody(registerSchema), register);

// ** RecipeRouter ** //
const recipeRouter = Router();
apiRouter.use('/recipe', recipeRouter);
recipeRouter.get('/suggestions', suggestions);
recipeRouter.post('/', processRequestBody(addSchema), add);

export default apiRouter;
