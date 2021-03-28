const express = require('express')
require('dotenv').config()

const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_PASS}@cluster0.wy6ti.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const port = 5000
const app = express()
app.use(bodyParser.json());
app.use(cors());

//console.log(process.env.DB_user)
app.get('/', (req, res) => {
  res.send('Hello Ema!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_Name}`).collection("products");
  // perform actions on the collection object
  console.log("database connected")
  //client.close();
  app.post('/addProducts', (req,res) => {
      const products = req.body;
      productsCollection.insertMany(products)
      .then(result => {
          console.log(result)
          res.send(result.insertedCount)
          console.log(result.insertedCount)
      })
  })

  //read data from database

  app.get('/products', (req, res) => {
      productsCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  //load single product for productDetails client
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
        res.send(documents[0]);
    })
})

app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, documents) => {
        res.send(documents);
    })
})
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 