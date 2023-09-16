
const serviceAutista = require('../service/servicoAutista');

module.exports = class AutistaController {
    
    async obterTodos(req, res) {
        try {
            let autistas = serviceAutista.obterTodos();
            return res.json(autistas);
        } catch (error) {
            console.log(error);
            return res.json({ mensagem:error.message });
        }
    }
    
    async obterPorId(req, res) {
        try {
            var id = req.params.id;

            let autista = serviceAutista.obterPorId(id);
            return res.json(autista);

        } catch (error) {
            console.log(error);
            return res.json({ mensagem:error.message });
        }
    }

    async cadastrar(req, res) {
        try {           
            let autista = serviceAutista.cadastrar(req.body);
            return res.json(autista);
            
        } catch (error) {
            console.log(error);
            return res.json({ mensagem:error.message });
        }
    }

    async atualizar(req, res) {
        try {
            var id = req.params.id;
            var autista = req.body || {};

            autista.id = parseInt(id);

            let autistaAtualizado = serviceAutista.atualizar(autista);
            return res.json(autistaAtualizado);

        } catch (error) {
            console.log(error);
            return res.json({ mensagem:error.message });
        }
    }
    
    async deletar(req, res) {
        try {
            var id = req.params.id;
            serviceAutista.deletar(id);
            return res.json({mensagem: `Autista com id ${id} foi deletado com sucesso`});

        } catch (error) {
            console.log(error);
            return res.json({ mensagem:error.message });
        }
    }
}