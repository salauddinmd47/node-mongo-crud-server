const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
 
const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 4000;

//password // 7qIDXg86PmGZYFyY


const uri = "mongodb+srv://crudUser:7qIDXg86PmGZYFyY@cluster0.4mjee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("Crud-Operation");
      const userCollection = database.collection("Users");

      // update api 
      app.put('/users/:id',async(req, res)=>{
        const id = req.params.id;
          const user = req.body;
          console.log(user)
          const filter = {_id:ObjectId(id)};
          const options = { upsert: true };
          const updatedUser= {
            $set:{
              name:user.name, email:user.email
            }
            
          }
          const result = await userCollection.updateOne(filter, updatedUser, options)
          res.send(result)


      })
      // Delete api
        app.delete('/users/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
            
             
        })

    //    GET API 
      app.get('/users',async(req, res)=>{
          const cursor = userCollection.find({});
          const users = await cursor.toArray() 
          res.send(users)
      })
      app.get('/users/:id',async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const user = await userCollection.findOne(query)
          res.send(user)
      })
        // POST API 
      app.post('/users',async(req, res)=>{
           const user = req.body;
           const result = await userCollection.insertOne(user);
            
           res.json(result)
      })
       
       
    } 
    finally {
    //    await client.close()
    }
  }
  run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('We are doing crud operation')
})
app.listen(port, ()=>{
    console.log('I am listening port',port)
})