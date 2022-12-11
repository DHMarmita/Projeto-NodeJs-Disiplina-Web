const Cadastro = require('../models/CadastroModels');
const Post = require('../models/PostModels');

exports.index = async(req, res) => {
    try {
        const posts = await Post.buscaPosts();
        res.render('index', {posts});
    } catch (error) {
        console.log(error);
        res.render('404');
    }
}

exports.cadastro = async function(req, res) {
    try {
        const cadastro = new Cadastro(req.body);
        await cadastro.register();

        if(cadastro.errors.length > 0){
            req.flash('errors', cadastro.errors);
            req.session.save(function(){
                return res.redirect('/');
            });
            return ;
        }
        req.flash('sucess', 'Cadastro realizado com sucesso');
        req.session.save(function(){
            return res.redirect('/');
        });
    }catch(e) {
        console.log(e);
        return res.render('404');
    }

};

exports.login = async function(req, res) {
    try {
        const cadastro = new Cadastro(req.body);
        await cadastro.login();

        if(cadastro.errors.length > 0){
            req.flash('errors', cadastro.errors);
            req.session.save(function(){
                return res.redirect('/');
            });
            return ;
        }

        req.flash('sucess', 'Login realizado com sucesso');
        req.session.user = cadastro.user;
        req.session.save(function(){
            return res.redirect('/');
        });
    } catch(e) {
        console.log(e);
        return res.render('404');
    }
};

exports.criar = async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.register();

        if(post.errors.length > 0){
            req.flash('errors', post.errors);
            req.session.save(function(){
                return res.redirect('/');
            });
            return ;
        }

        req.flash('sucess', 'Postagem criada com sucesso');
        req.session.save(() => res.redirect('/'));
    } catch (error) {
        console.log(error);
        res.render('404');
    }
};

exports.filtrar = async(req, res) => {
    try {
        if(!req.body.busca){
            req.flash('errors', 'Preencha todos os campos do filtro');
            req.session.save(() => res.redirect('/'));
            return;
        }
        res.redirect(`/${req.body.busca}`);
    } catch (error) {
        console.log(error);
        res.render('404');
    }
};

exports.filtro = async(req, res) => {
    try {
        const posts = await Post.buscaPostsFiltro(req.params.busca);
        res.render('index', {posts});
    } catch (error) {
        console.log(error);
        res.render('404');
    }
};