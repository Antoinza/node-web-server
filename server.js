const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// Middleware
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });

  next();
})
app.use((req,res,next) => {
  res.render('maintenance.hbs');
});
// <- end middleware

// Helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
}); // <- getCurrentYear
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
}); // <- screamIt
// <- end helpers

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Andrew',
  //   likes: [
  //     'Biking',
  //     'Cooking'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the home page'
  });
});

app.get('/about', (req,res) => {
  //res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// route at '/bad' -> send back json with an errorMessage propertiy
app.get('/bad', (req,res) => {
  res.send({
    errorMessage: 'Unable to process request'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
