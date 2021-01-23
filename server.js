//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true}))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'alenzo',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configurar a aparesentação da página
server.get("/", function(req, res) {
    
    db.query("SELECT * FROM doadores", function(err, result) {
        if(err) return res.send("Erro de banco de dados.")

        const doadores = result.rows
        return res.render("index.html", { doadores })
    })
})

server.post("/", function(req, res) {
    //pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const sangue = req.body.sangue

    //Se o nome OU o email OU o sangue for igual a vazio, retorne... 
    if (name == "" || email == "" || sangue == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do banco de dados
    const query = `INSERT INTO doadores ("name", "email", "sangue") VALUES ($1, $2, $3)`

    const values =  [name, email, sangue]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })
})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function() {
    console.log("iniciei o servidor.")
})