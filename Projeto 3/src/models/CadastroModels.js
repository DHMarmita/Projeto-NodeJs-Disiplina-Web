const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const CadastroSchema = new mongoose.Schema({
    email: { type: String, require: true },
    senha: { type: String, require: true },
    administrador: {type: String}
});

const CadastroModel = mongoose.model("Cadastro", CadastroSchema);

class Cadastro {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida_login();
        if (this.errors.length > 0) return;
        this.user = await CadastroModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push("Usuário não existe.");
            return;
        }
        if (!bcryptjs.compareSync(this.body.senha, this.user.senha)) {
            this.errors.push("Senha inválida");
            this.user = null;
            return;
        }
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        //Verificar se há um email já cadastrado
        await this.userExists();

        //Criptografar a senha
        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.user = await CadastroModel.create(this.body);
    }

    async userExists() {
        this.user = await CadastroModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push("Usuário já cadastrado");
    }

    valida() {
        this.cleanUp();
        //Validação
        //Email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");

        //Senha mais que 3 caracteres
        if (this.body.senha.length <= 3) {
            this.errors.push("A senha deve ser maior do que 3 caracteres");
        }
    }

    valida_login() {
        this.cleanUp();
        //Email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");

        //Senha mais que 3 caracteres
        if (this.body.senha.length <= 3) {
            this.errors.push("A senha deve ser maior do que 3 caracteres");
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }
        this.body = {
            email: this.body.email,
            senha: this.body.senha,
            administrador: this.body.administrador
        };
    }
}

module.exports = Cadastro;
