const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    titulo: {type: String, require:true},
    descricao: {type: String, require:true},
    imagem:{data: Buffer, contentType: String}
});

const PostModel = mongoose.model('Post', PostSchema);

class Post{
  constructor(body){
    this.body = body;
    this.errors = [];
    this.post = null;
  }

  async register(){
    this.valida();
    if(this.errors.length > 0)return;

    this.post = await PostModel.create(this.body);
  }

  valida(){
    this.cleanUp();
    //Validação
    //Titulo
    if(this.body.titulo.length <= 3){
      this.errors.push('O título deve ter mais que 3 caracteres');
    }
    //Descrição
    if(this.body.descricao.length <= 3){
      this.errors.push('A decsrição deve ter mais que 3 caracteres');
    }
    //Imagem
    if(this.body.imagem == null){
      this.errors.push('É necessário uma imagem para fazer a postagem');
    }
  }

  cleanUp(){
    for(const key in this.body){
      if (typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }
    this.body = {
      titulo: this.body.titulo,
      descricao: this.body.descricao,
      imagem: this.body.imagem
    };
  }
};

Post.buscaPosts = async function(){
  const posts = await PostModel.find()
    .sort({criadosEm: -1});
  return posts;
}

Post.buscaPostsFiltro = async function(buscar){
  const post = await PostModel.find({titulo:  buscar})
    .sort({criadosEm: -1});
  return post;
}

module.exports = Post;