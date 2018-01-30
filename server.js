// create server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

// bodyParser middleware changes req or res before our app handles it
// otherwise, submitted forms will give us input of undefined
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))

var db;

MongoClient.connect('mongodb://hianson:ansoniscool@ds117848.mlab.com:17848/crud-tester', (err, database) => {
  if (err) return console.log(err)
  db = database.db('crud-tester')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})


// handling a GET request from client/browser:
// how to send something from server to client
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})


// express handling form data...
// how do we get the input from the form into express?
// express can't, so we need to use a middleware/library called body-parser!!! :(
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
