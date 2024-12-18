const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 3000

MongoClient.connect('mongodb+srv://beaudfoster:MQc1LwtgVcBx7Y2p@cluster0.imeuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(client =>{
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')


    app.use(express.urlencoded({extended: true}))
    app.set('view engine', 'ejsa')
    app.use(express.static('public'))
    app.use(express.json())



    app.get('/', (req, res)=>{
        const cursor = db.collection('quotes').find().toArray().then(results => {
            res.render('index.ejs',{quotes: results})
        })
            .catch(error => console.error(error))
    })

    app.post('/quotes', (req, res)=>{
        quotesCollection
        .insertOne(req.body)
        .then(results => {
            console.log(results)
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true
          }
        )
        .then(result => {
            res.json('Success')
        })
    })


    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne(
          { name: req.body.name }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              return res.json('No quote to delete')
            }
            res.json('Deleted Darth Vadar\'s quote')
          })
          .catch(error => console.error(error))
      })


    app.listen(PORT, (req,res)=>{
        console.log('listnening on 3000')
    })


}).catch(console.error)
