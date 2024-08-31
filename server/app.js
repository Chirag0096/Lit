const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@reactapp.0ltwq.mongodb.net/?retryWrites=true&w=majority&appName=ReactApp`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let chatCollection;

async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("LIT_PROTOCOL");
    chatCollection = db.collection("Chats");
  } catch (e) {
    console.error(e);
  }
}

connectToDb();

function newChat(userId) {
  if (userId) {
    return chatCollection.insertOne({
      author: userId,
      title: 'New Chat',
      conversation: [{
        author: 'model',
        message: 'Hi, Let\'s start the convo!'
      }]
    });
  }
}

async function insertChat(userType, author, chatId, message) {
  if (userType !== 'model') {
    const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
    if (chat.conversation.length === 1) {
      chat.title = message;
    }

    if (chat.author === author) {
      chat.conversation.push({
        author: 'user',
        message: message
      });
      await chatCollection.updateOne({ _id: new ObjectId(chatId) }, { $set: chat });
      return { result: 'inserted' };
    }
  } else {
    const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
    if (chat.author === author) {
      chat.conversation.push({
        author: 'ai',
        message: message
      });
      await chatCollection.updateOne({ _id: new ObjectId(chatId) }, { $set: chat });
      return { result: 'inserted' };
    }
  }
}

async function getAns(query) {
  try {

    return "This is the response"
    const res = await axios.post(process.env.MODEL_URI + '/predict', { query });
    return res.data.response;
  } catch (error) {
    console.error(error);
    return "The model is offline! please try again later!";
  }
}

app.get('/chats', async (req, res) => {
  const userId = req.headers['user-id'];
  if (userId) {
    const titles = await chatCollection.find({ author: userId }).map(chat => ({
      title: chat.title,
      id: chat._id.toString()
    })).toArray();
    res.json({ chats: titles });
  } else {
    res.json({ chats: "No chats!" });
  }
});

app.get('/chat/:chatId', async (req, res) => {
  const userId = req.headers['user-id'];
  const chatId = req.params.chatId;

  if (chatId === 'new') {
    const result = await newChat(userId);
    res.json({ id: result.insertedId.toString() });
  } else {
    const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });
    chat._id = chat._id.toString();
    res.json({ chat });
  }
});

app.post('/query/:chatId', async (req, res) => {
  const userId = req.headers['user-id'];
  const chatId = req.params.chatId;
  const { query } = req.body;

  await insertChat('user', userId, chatId, query);
  const response = await getAns(query);
  await insertChat('model', userId, chatId, response);

  res.json({ response });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));