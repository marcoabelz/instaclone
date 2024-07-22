const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://abelgryta:${process.env.PASSWORD_MONGODB_CONFIG}@cluster0.9julpb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// `mongodb+srv://abelgryta:TT0VIuOBAwZhQyDk@cluster0.9julpb8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("gc01-instagram");

module.exports = {
  client,
  database,
};
