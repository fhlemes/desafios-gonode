const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const moment = require('moment');
const session = require('express-session');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ resave: false, saveUninitialized: false, secret: 'cachorro' }));

// middleware das rotas maior ou menor
const midCheckIdade = (req, res, next) => {
  if (!req.session.message) {
    res.redirect('/');
  } else {
    next();
  }
};

// renderiza para página principal
app.get('/', (req, res) => {
  res.render('index');
});

/* eslint-disable */
// checa a idade do visitante, se é maior ou menor
app.post('/check', (req, res) => {
  const { name, idade } = req.body;

  const checkIdade = moment().diff(moment(idade, 'DD/MM/YYYY'),'years');

  if(checkIdade >= 18) {
    req.session.message = name;
    res.redirect('/major');
  } else {
    req.session.message = name;
    res.redirect('/minor');
  }

});

// caso seja maior de idade é exibido o template major
app.get('/major', midCheckIdade, (req, res) => {
  res.render('major', { name: req.session.message });
});

// caso seja menor de idade é exibido o template minor
app.get('/minor', midCheckIdade, (req, res) => {
  res.render('minor', { name: req.session.message });
});

// escuta a porta 3000
app.listen(3000);
