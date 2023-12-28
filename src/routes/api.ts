import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import { register, registerSchema } from './user/register.post';
import { all } from './user/all.get';
import { add, addSchema } from './recipe/add.post';
import { suggestions, suggestionsSchema } from './recipe/suggestions.get';
import { login, loginSchema } from './user/login.post';
import { authMiddleware } from '@src/services/auth';
import { mine } from './recipe/mine';
import { update, updateSchema } from './user/update.post';
import { one, oneSchema } from './recipe/one';
import { like, likeSchema } from './recipe/like.post';
import { otherLikes } from './recipe/otherLikes';
import { me } from './user/me.get';
import { upload } from './utils/upload.post';
import { parseImage } from '@src/services/upload';
import { allSchema } from './recipe/all.get';
import { remove, removeSchema } from './recipe/delete.delete';

const apiRouter = Router();
apiRouter.use(authMiddleware.unless({
	path: ["/api/user/login", "/api/user/register"]
}))



// ** UtilsRouter ** //
const utilRouter = Router();
apiRouter.use('/util', utilRouter);
utilRouter.post('/upload', parseImage('image'), upload);

// ** UserRouter ** //
const userRouter = Router();
apiRouter.use('/user', userRouter);
userRouter.get('/', all);
userRouter.get('/me', me);
userRouter.post('/login', processRequestBody(loginSchema), login);
userRouter.post('/register', processRequestBody(registerSchema), register);
userRouter.post('/update', processRequestBody(updateSchema), update);

// ** RecipeRouter ** //
const recipeRouter = Router();
apiRouter.use('/recipe', recipeRouter);
recipeRouter.get('/', processRequestBody(allSchema), all);
recipeRouter.get('/suggestions', processRequestBody(suggestionsSchema), suggestions);
recipeRouter.get('/mine', mine);
recipeRouter.get('/one', processRequestBody(oneSchema), one);
recipeRouter.post('/', processRequestBody(addSchema), add);
recipeRouter.put('/', processRequestBody(updateSchema), update);
recipeRouter.delete('/', processRequestBody(removeSchema), remove);
recipeRouter.post('/like', processRequestBody(likeSchema), like);
recipeRouter.get('/other-likes', otherLikes);

export default apiRouter;
