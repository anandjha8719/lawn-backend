const express = require("express");
const client = require("./src/db-connect");

const app = express();
const port = 8000;

// Dummy data to insert into the "cars" collection
const dummyCars = [
  { make: "Toyota", model: "Camry", year: 2021 },
  { make: "Honda", model: "Civic", year: 2020 },
  { make: "Ford", model: "Mustang", year: 2022 },
];

app.use(express.json());

// Route to handle POST requests for creating client requests
app.post("/client-requests", async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully");

    // Get the clientRequests collection
    const collection = client.db("test").collection("clientRequests");

    // Insert the client request data into the collection
    const result = await collection.insertOne(req.body);
    console.log("Client request saved successfully:", result.insertedId);

    res
      .status(201)
      .json({
        message: "Client request saved successfully",
        requestId: result.insertedId,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error saving client request" });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.get("/", async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully");

    // Get the "cars" collection
    const collection = client.db("test").collection("cars");

    // Insert dummy data into the "cars" collection
    const result = await collection.insertMany(dummyCars);
    console.log("Inserted data count:", result.insertedCount);

    // Fetch and log the inserted data
    const insertedData = await collection.find().toArray();
    console.log("Fetched data:", insertedData);

    res.send("Data inserted successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error inserting data into MongoDB");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
