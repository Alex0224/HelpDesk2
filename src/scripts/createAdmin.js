const pool = require('../../database/database');
const argon2 = require('argon2');

async function inserirAdmin() {
    const nome = process.argv[2];
    const email = process.argv[3];
    const senha = process.argv[4];

    if(!nome || !email || !senha){
        console.log('Informe nome, e-mail e senha.');
        return;
    } else if(nome.trim() == "" || email.trim() == "" || senha == ""){
        console.log('Os campos não podem estar vazios.');
        return;
    }
        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim();
        const role = "admin";
        const is_active = 1;

        try{
            const [resultado] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [emailLimpo]);

            if(resultado.length>0){
                console.log("Email já cadastrado.");
                return;
            } else{
                const senhaHash = await argon2.hash(senha);
                const [inserindoDados] = await pool.query("INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)", [nomeLimpo, emailLimpo, senhaHash, role, is_active]);
                console.log(`Administrador criado com sucesso. ID: ${inserindoDados.insertId}`);
            }
        } catch(erro){
            console.log("Erro ao inserir admin no banco.");
            console.log(erro);
        }
}

inserirAdmin().catch(erro =>{
    console.error("Erro inesperado", erro.message);
    process.exitCode = 1;
}).finally(async ()=>{
    await pool.end();
});
