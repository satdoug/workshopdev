const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

const db = require('./db.js');
// const ideas = [
//     {
//     img:"https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title:"Cursos de Programação",
//     category:"Estudo",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum amet eum pariatur quidem provident quas repellat, culpa perferendis. Facere mollitia illum omnis laudantium nobis provident, et velit? Laboriosam, nesciunt. Ab.",
//     url:"http://rocketseat.com.br",
// },
// {
//     img:"https://image.flaticon.com/icons/svg/2729/2729005.svg",
//     title:"Exercício",
//     category:"Saúde",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum amet eum pariatur quidem provident quas repellat, culpa perferendis. Facere mollitia illum omnis laudantium nobis provident, et velit? Laboriosam, nesciunt. Ab.",
//     url:"https://www.exercicioemcasa.com.br/",
// },
// {
//     img:"https://image.flaticon.com/icons/svg/2729/2729032.svg",
//     title:"Karaokê",
//     category:"Diversão em Família",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum amet eum pariatur quidem provident quas repellat, culpa perferendis. Facere mollitia illum omnis laudantium nobis provident, et velit? Laboriosam, nesciunt. Ab.",
//     url:"https://www.tvkaraoke.com.br/",
// },
// {
//     img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
//     title:"Meditação",
//     category:"Mentalidade",
//     description:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum amet eum pariatur quidem provident quas repellat, culpa perferendis. Facere mollitia illum omnis laudantium nobis provident, et velit? Laboriosam, nesciunt. Ab.",
//     url:"https://www.personare.com.br/meditacao",
// },
// ]


server.use(express.static("public"));
server.use(express.urlencoded({ extended: true}));

nunjucks.configure("views", {
    express: server,
    noCache: true,
})

server.get("/", function (req, res) {
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err){
            console.log(err);
            return res.send('Erro no banco de dado.');
        } 

        const reverseIdeas = [...rows].reverse();

        let lastIdeas = []
        for (let idea of reverseIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea);
            }
        }

        return res.render('index.html', { ideas: lastIdeas });
    });
})

server.get("/ideias", function (req, res) {
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err){
            console.log(err);
            return res.send('Erro no banco de dado.');
        } 
        
        const reverseIdeas = [...rows].reverse();

        return res.render('ideias.html', { ideas: reverseIdeas });
    });
})

server.post("/", function (req, res) {
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?)
    `;

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function(err){
        if (err){
            console.log(err);
            return res.send('Erro no banco de dado.');
        } 

        return res.redirect('/ideias');
    });

});

server.listen(3001);