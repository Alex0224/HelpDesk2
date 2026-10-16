const pool = require("../../database/database");
const argon2 = require('argon2');

async function login(req, res){

    const email = req.body.email;
    const senha = req.body.senha;

    try{

        const [resultado] = await pool.query("SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1", [email]);
    
        if(resultado.length === 0){
            return res.status(401).json({
                erro: 'Email ou Senha inválidos.'
            });
        } 
        
        const usuario = resultado[0];

        const senhaValida = await argon2.verify(usuario.password_hash, senha);
        
        if(!usuario.is_active){
            return res.status(409).json({
                mensagem: "Usuário inátivo."
            });
        }

        if(!senhaValida){
            return res.status(401).json({
                mensagem: "Email ou Senha inválidos."
            });
        }

        return res.status(200).json({
            mensagem: "Credenciais válidas.",
            usuario: {
                id: usuario.id,
                nome: usuario.name,
                email: usuario.email,
                role: usuario.role
            }
        });


    } catch (erro) {
        console.log(erro.message)
        return res.status(500).json({
            mensagem: "Erro inesperado!",
        });
    }
    
}

module.exports = { login }