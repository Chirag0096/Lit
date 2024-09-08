import axios from "axios";

const baseURL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: baseURL,
  headers: { "X-Custom-Header": "foobar" },
});

const getChat = async (userId, id) => {
  return await api.get(`/chat/${id}`, {
    headers: {
      "user-id": userId,
    },
  });
};

const newChat = async (userId) => {
  return await api.get("/chat/new", {
    headers: {
      "user-id": userId,
    },
  });
};

const getAllChats = async (userId) => {
  return await api.get("/chats", {
    headers: {
      "user-id": userId,
    },
  });
};

const queryModel = async (userId, chatId, query) => {
  return await api.post(
    `/query/${chatId}`,
    {
      query: query,
    },
    {
      headers: {
        "user-id": userId,
      },
    }
  );
};


const queryImageModel = async (userId, chatId, query) => {
  return await api.post(
    `/imagequery/${chatId}`,
    {
      query: query
    },
    {
      headers: {
        "user-id": userId,
      },
    }
  )
}

export { getAllChats, getChat, queryModel, newChat, queryImageModel };
