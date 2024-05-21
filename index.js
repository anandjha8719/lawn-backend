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

//this is check fo empty of non-valid necessery fields
const validateClientRequest = (data) => {
  const errors = [];
  const { address, requestedDate } = data;

  if (!address) {
    errors.push("Address is required.");
  }

  if (!requestedDate) {
    errors.push("Requested date is required.");
  } else {
    const requestedDateObj = new Date(requestedDate);
    const currentDate = new Date();
    if (requestedDateObj < currentDate) {
      errors.push("Requested date cannot be in the past.");
    }
  }

  return errors;
};

// Route to handle POST requests for creating client requests
app.post("/client-requests", async (req, res) => {
  const errors = validateClientRequest(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully");

    // Get the clientRequests collection
    const collection = client.db("test").collection("clientRequests");

    // Insert the client request data into the collection
    const result = await collection.insertOne(req.body);
    console.log("Client request saved successfully:", result.insertedId);

    res.status(201).json({
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

app.listen(port, () => {
  console.log("Server running on port", port);
});
