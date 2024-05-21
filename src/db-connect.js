const { MongoClient, ServerApiVersion } = require("mongodb");
const { connectString } = require("../secret");

const client = new MongoClient(
  "mongodb+srv://anandjha8719:anandjha@clustertest.rpqgode.mongodb.net/?retryWrites=true&w=majority&appName=clustertest",
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

module.exports = client;
