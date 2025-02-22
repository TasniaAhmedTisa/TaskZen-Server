const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


const uri = process.env.MONGODB_URI 

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
    const usersCollection = client.db("TaskZen").collection("users");

    const tasksCollection = client.db("TaskZen").collection('tasks')

     // Store User Details Upon First Login
     app.post("/users", async (req, res) => {
      const { uid, email, displayName } = req.body;

      if (!uid || !email) {
        return res.status(400).json({ error: "User ID and Email are required." });
      }

      try {
        const existingUser = await usersCollection.findOne({ uid });

        if (!existingUser) {
          const newUser = { uid, email, displayName, createdAt: new Date() };
          await usersCollection.insertOne(newUser);
          return res.status(201).json({ message: "User added successfully" });
        }

        res.status(200).json({ message: "User already exists" });
      } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
      }
    });

    // Fetch all tasks (GET)
    app.get("/tasks", async (req, res) => {
  
    const cursor = tasksCollection.find();
    const result = await  cursor.toArray()
    res.send(result);
    
     });

     app.post('/tasks', async (req, res) => {
      const { title, description, dueDate, category } = req.body;
    
      if (!title || !description || !dueDate || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
    
      try {
        const result = await tasksCollection.insertOne({
          title,
          description,
          dueDate,
          category,
          createdAt: new Date(),
          
        });
    
        res.status(201).json({ message: 'Task added successfully', taskId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: 'Error adding task', error: error.message });
      }
    });

    // Edit a task (PUT)
    app.put('/tasks/:id', async (req, res) => {
      const taskId = req.params.id ;
      const { title, description, dueDate, category } = req.body;

      if (!title || !description || !dueDate || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      try {
        const objectId = new ObjectId(taskId);

        const updatedTask = await tasksCollection.updateOne(
          { _id: objectId },          {
            $set: {
              title,
              description,
              dueDate,
              category,
              updatedAt: new Date(),
            },
          }
        );

        if (updatedTask.matchedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
      }
    });

    // Delete a task (DELETE)
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  
  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  try {
    const objectId = new ObjectId(taskId);
    const result = await tasksCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
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