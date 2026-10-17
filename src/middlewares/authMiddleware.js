function exigirAutenticacao(req, res, next){
    if(!req.session.usuario){
        if(req.path.startsWith('/api/')){
            return res.status(401).json({
                mensagem: "Usuário não autenticado."
            });
        }

        return res.redirect('/');
    }

    next()
}

module.exports = exigirAutenticacao;