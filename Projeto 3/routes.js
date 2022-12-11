const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');

route.get('/', homeController.index);
route.post('/login', homeController.login);
route.post('/cadastro', homeController.cadastro);
route.post('/postar',homeController.criar);
route.post('/filtrar', homeController.filtrar);
route.get('/:busca', homeController.filtro);


module.exports = route;