import Koa, { type Context } from 'koa';
import logger from 'koa-logger';
import Router from '@koa/router';

const app = new Koa();
const router = new Router()

app.use(logger());

const helloWorld = (ctx: Context) => {
  ctx.body = 'Hello World!!';;
};

router.get('/', helloWorld);

app.use(router.routes());

app.listen(3000);
