const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
  }
});

const Router = require('koa-router');
const router = new Router();

let clients = [];
const history = [];

const saveRequest = async (ctx) => {
  await new Promise((resolve, reject) => {
    ctx.resolve = resolve;
    ctx.reject = reject;
    clients.push(ctx);
  }).catch(() => {
    debugger;
  });
};

const setHandlers = async (ctx, next) => {
  ctx.request.req.on('close', () => {
    const index = clients.indexOf(ctx);
    clients.slice(index, 1);
  });
  return next();
};

const handleUserWithoutHistory = async (ctx, next) => {
  const msgAmount = parseInt(ctx.request.query.ms_amount) || 0;
  if (msgAmount !== history.length) {
    ctx.response.status = 200;
    if (history.length === 1) {
      ctx.response.body = history[0];
    } else {
      ctx.response.body = history.join('\n');
    }

    return;
  }
  return next();
};


router.get('/subscribe',
    setHandlers,
    handleUserWithoutHistory,
    saveRequest,
);

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  history.push(message);


  clients.forEach(({response, resolve}) => {
    response.body = message;
    response.status = 200;
    resolve(message);
  });

  clients = [];

  ctx.response.body = 'ok';
  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;
