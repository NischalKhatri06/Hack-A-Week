// db.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://06nischalkc_db_user:EsXveaEyTsrlJzyE@cluster0.kyrgw4a.mongodb.net/HackAWeekDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); 
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDB };
