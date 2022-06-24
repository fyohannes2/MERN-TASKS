const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());


const { MongoClient, ObjectID } = require('mongodb');

let db;

MongoClient.connect('mongodb+srv://admin:abc1234@clusterb.t5btr.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true },  async function (err, client) {
    if (err) throw err

  db = client.db('todos');
  await db.collection('todos').deleteMany();

  await db.collection('todos').insertMany([
    { done: true, desc: 'Code.' },
    { done: true, desc: 'sleep.' },
    { done: false, desc: 'Code.' }
  ]);
});//


app.get('/', (req, res) => {
  res.json('did this work!');
});

app.get('/todos', async (req, res) => {
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  await db.collection('todos').insertOne(req.body);
  res.json('posted');
});

app.delete('/todos/:id', async (req, res) => {
  await db.collection('todos').deleteOne({ _id: ObjectID(req.params.id) });
  res.json('deleted');
});

app.put('/todos/:id', async (req, res) => {
  await db.collection('todos').replaceOne({ _id: ObjectID(req.params.id)}, req.body);
  res.json('putted');
});

app.listen(process.env.PORT || 3001, () => {
  console.log('work pls');
});
//
