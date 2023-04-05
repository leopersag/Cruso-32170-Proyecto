const koa = require ('koa');
const {koaBody} = require ('koa-body');
const routerKoa = require('./koa.router');

const app = new koa();

app.use(koaBody());

app.use(routerKoa.routes())

const PORT = 3000
const server = app.listen(PORT,  ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
})
server.on('error', error => console.log(`Error en Servidor Koa: ${error}`));