const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


const uri = process.env.MONGODB_URI || "mongodb+srv://taskzen:erDjvNHkWRaeZFLC@cluster0.1e2dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const tasksCollection = client.db("TaskZen").collection('tasks')
    // Fetch all tasks (GET)
    app.get("/tasks", async (req, res) => {
  
    const cursor = tasksCollection.find();
    const result = await  cursor.toArray()
    res.send(result);
    
     });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



// Default route
app.get("/", (req, res) => {
    res.send(" Task Management Server is Running!");
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });