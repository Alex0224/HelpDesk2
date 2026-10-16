const pool = require('./database/database')

async function testarConexao() {
    
    try{
        const [resultado] = await pool.query('SELECT 1');

        console.log("Conexão com MySQL funcionando.");
        console.log(resultado);
    } catch (erro){
        console.log("Não houve conexão com o banco de dados.");
        console.log(erro.message);
    }
}

async function totalUsuarios() {
    try {
        const [resultado] = await pool.query("SELECT COUNT(*) AS total FROM users");

        console.log(`Usuários encontrados: ${resultado[0].total}`);
    } catch(erro){
        console.log("Erro ao buscar quantidade de usuários.");
        console.log(erro.message);
    }
}

testarConexao();
totalUsuarios();