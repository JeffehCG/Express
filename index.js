const express = require('express') //Importando express
const app = express() //Instanciando o express
const bodyParse = require('body-parser') //Importando body-parse

const saudacao = require('./saudacaoMiddleware')
const usuarioApi = require('./API/usuario') //Importando modulo
const produtoApi = require('./API/produto')

//CHAMANDO O MODULO PRODUTO
produtoApi(app,'com param!')

//USANDO O MODULO USUARIO
app.post('/usuario', usuarioApi.salvar)
app.get('/usuario', usuarioApi.obter)

//DEFININDO O TIPO QUE O BODY PARSER IRA INTERPRETAR (MIDDLEWARE)
app.use(bodyParse.text()) //todos arquivos textos passados pelo body seram interpretados
app.use(bodyParse.json()) //todos arquivos json passados pelo body seram interpretados
app.use(bodyParse.urlencoded({extended: true}))

//FUNÇÃO MIDDLEWARE DE OUTRO ARQUIVO
app.use(saudacao('Guilherme')) //saudacao - função middleware dentro do arquivo saudacaoMiddleware.js

//MIDDLEWARE (Função que recebe (req, res, next) , quando next não vai ser utilizado, não precisa colocar ele)
app.use('/opa',(req,res, next) => { //next é usado para que no fim desse metodo, sera encaminhado para o proximo, com a mesma url (/opa)
    console.log('Antes...')
    next() //Sem o next , só seria passado por essa função, e as de baixo com a mesma url seriam ignoradas
})

//RESPOSTAS 
app.get('/opa',(req, res, next) => { //Metodo use recebe uma requisição, e uma resposta (é utilizado para qualquer tipo de requisição)
    console.log('Durante...')

    // res.send('Estou <b>bem</b>!') //resp.send - manda uma resposta pra pagina

    // res.json({ //Converte um conteudo js em json , e manda uma respota pra pagina
    //     name: 'iPad 32G',
    //     price: 1899.00,
    //     discount: 0.12
    // })

    // res.json([ //Passando um array em json como resposta
    //     {id: 7, name: 'Ana', position: 1},
    //     {id: 34, name: 'Bia', position: 2},
    //     {id: 73, name: 'Carlos', position: 3}
    // ])

    res.json({ //Passando um objeto, com um array, e informações da requisição
        data:[ 
            {id: 7, name: 'Ana', position: 1},
            {id: 34, name: 'Bia', position: 2},
            {id: 73, name: 'Carlos', position: 3}
        ],
        count: 30,
        skip: 0,
        limit: 3,
        status: 200
    })
    next()
})

//app.all , use (são funcões que recebem qualquer requisiçaõ)

app.use('/opa',(req,res) => { 
    console.log('Depois...')
})

//LENDO DADOS DA REQUISIÇÃO
app.get('/clientes/relatorio', (req, res) => {
    res.send(`Cliente relatorio: completo = ${req.query.completo} ano = ${req.query.ano}`)
}) //http://localhost:3002/clientes/relatorio?completo=true&ano=2018 --URL que foi passada para o metoda acima

app.get('/clientes/:id', (req, res) => {
    res.send(`Cliente ${req.params.id} selecionado!`)
})

//FUNÇÂO MIDDLEWARE PARA PEGAR OS PARAMETROS DE BODY
app.post('/corpo', (req, res) => {
    // let corpo = ''
    // req.on('data', function(parte){ //req.on('data') - quando esta chegando dados por parte
    //     corpo += parte
    // })

    // req.on('end', function(){ //Mandando como resposta tudo que foi recebido
        // res.send(corpo)
    // })
    res.send(JSON.stringify(req.body.nome)) //Usando o body-parser (apenas essa linha consegue retornar o valor contido no body)
}) //No postman é preciso selecionar a opção body , e em x-www, e digitar as keys e os valores (passando a url, o sistema retornara esses valores)

app.listen(3002, () => { //Express ficara ouvindo a porta 3000
    console.log('Backend Executando...')
})