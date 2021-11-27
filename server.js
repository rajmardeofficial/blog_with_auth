const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'rajmarde1816',
    database: 'blogwithauthentication'
});

connection.connect(function(err){
    if(err) throw err;
    console.log('connected..')
})

app.get('/', (req, res)=>{
    connection.query(
        'SELECT * FROM articles',
        (error, results)=>{
            res.render('list', {articles: results});
        }
    )

})


app.post('/', (req, res)=>{
    let heading = req.body.heading;
    let summary = req.body.summary;
    let content = req.body.content;
    connection.query(
        'INSERT INTO articles (title, summary, content) VALUES (?,?,?)',
        [heading, summary, content],
        (error, results) =>{
            console.log(error)
        }
    )
})

app.get('/article/:id', (req, res)=>{
    const id = req.params.id;
    connection.query(
        'SELECT * FROM articles WHERE id = ?',
        [id],
        (error, results)=>{
            res.render('article', {article: results[0]});
        }
    )

})


app.get('/admin', (req, res)=>{
    res.render('admin')
})

//login route

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results)=>{
            if(results.length > 0){
                if(password === results[0].password){
                    console.log('Authentication success')
                    res.redirect('/')
                } else{
                    console.log('Authentication failed')
                    res.redirect('/login')
                }
            } else{
                res.redirect('/login')
            }
        }
    )


})

app.listen(port, ()=>console.log(`Listening on port ${port}`));