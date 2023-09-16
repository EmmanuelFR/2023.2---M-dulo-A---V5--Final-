const express = require("express");
const routes = express.Router();

const usuarioService = require('./src/service/servicoUsuario');
const UsuarioController = require('./src/controllers/UsuarioController');
const AutistaController = require('./src/controllers/AutistaController');
const ProdutoController = require('./src/controllers/ProdutoController');

const usuarioController = new UsuarioController();
const autistaController = new AutistaController();
const produtoController = new ProdutoController();

routes.use(async (req, res, next) => {

    if(process.env.AUTENTICAR =="TRUE"){

        let { authorization } = req.headers;
        let autenticado = await usuarioService.validarAutenticacao(authorization);
      
        if(req.originalUrl != '/login' && !autenticado ) {
            return res.status(401).json({ mensagem:"Por segurança o seu login de acesso expirou, efetue-o novamente." })
        }
    }

    next();
});

//produto
routes.get("/produtos", produtoController.obterTodos);
routes.get("/produtos/:id", produtoController.obterPorId);
routes.post('/produtos', produtoController.cadastrar);
routes.put("/produtos/:id", produtoController.atualizar);
routes.delete("/produtos/:id", produtoController.deletar);

//autista
routes.get("/autistas", autistaController.obterTodos);
routes.get("/autistas/:id", autistaController.obterPorId);
routes.post('/autistas', autistaController.cadastrar);
routes.put("/autistas/:id", autistaController.atualizar);
routes.delete("/autistas/:id", autistaController.deletar);

//usuario
routes.get("/usuarios", usuarioController.obterTodos);
routes.get("/usuarios/:id", usuarioController.obterPorId);
routes.post("/login", usuarioController.login);
routes.delete("/logout", usuarioController.logout);

module.exports = routes;