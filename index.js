const express = require('express')
// const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middle Wares
app.use(cors()); // For Get Method
app.use(express.json()); // For Post Method

// User Name: knowledgeUserDb process.env.DB_USER
// User Password: LF1520fWLZ7f4JSJ process.env.DB_PASSWORD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ik3p7tj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const knowledgeCollection = client.db("knowledge").collection("services");
        const reviewCollection = client.db("knowledge").collection("review");
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = knowledgeCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        
        app.get('/homeServices', async (req, res) => {
            const query = {};
            const options = {
                // sort returned documents in ascending order by title (A->Z)
                sort: { _id: -1 }
              };
            const cursor = knowledgeCollection.find(query, options);
            const result = await cursor.limit(3).toArray();
            res.send(result)
        })
        app.post('/homeServices', async (req, res) => {
            const allService = req.body;
            const result = await knowledgeCollection.insertOne(allService);
            res.send(result);
        })

          app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await knowledgeCollection.findOne(query);
            res.send(result)
          })

        // Post Method
        // Insert Method
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // All review api data
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Current user api data
        app.get('/currentReview', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Delete
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        // Update
        app.patch('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
          })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})