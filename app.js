
/* To enable this snippet, type 'express' */ 

const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');

/* To use bodyParser, you can use the */
/* req.body.<name_attribute_from_html>, */
/* to retrieve data from a html form. */

/* To use any CSS file, you would have to */
/* 'link the stylesheet to the HTML document, */
/* and create a public directoy, containing a css directory. */
/* After creating, this directories, and adding the link to the HTML, */
/* you have to explicitly tell express to use the public files */
/* with adding line above these comments. */

const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))


/* In order to get 'ejs' working, */
/* view documentation on https://ejs.co/ */
/* to use ejs tags and to use render methods as well. */

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', function(req,res) {
res.render("home");
});

app.get('/login', function(req,res) {
    res.render("login");
    });

app.get('/register', function(req,res) {
res.render("register");
        });


app.listen(3000, function(){
console.log('You are listening to Port:3000');
});