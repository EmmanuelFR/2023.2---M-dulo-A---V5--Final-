class Autista {
    constructor(obj) {
        obj = obj  || {};

        this.id = obj.id;
        this.nome = obj.nome;
        this.genero = obj.genero;
        this.idade = obj.idade;
        this.responsavel = obj.responsavel;
        this.contato = obj.contato;
        this.cid = obj.cid;
        this.nivel = obj.nivel;
        this.dataCadastro = obj.dataCadastro;
    }
}