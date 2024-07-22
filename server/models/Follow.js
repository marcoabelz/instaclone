const { ObjectId } = require("mongodb");
const { database } = require("../config/mongoConnection");

class Follow {
  static async create(body) {
    try {
      const follows = database.collection("follows");
      // console.log(body);
      body.followingId = new ObjectId(body.followingId);
      body.updatedAt = body.createdAt = new Date();
      //   console.log(body);
      const data = await follows.insertOne(body);
      const result = await follows.findOne(data.insertedId);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const follows = database.collection("follows");
      const data = await follows.find().toArray();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findById(_id) {
    try {
      const follows = database.collection("follows");
      const data = await follows.findOne({
        _id: new ObjectId(_id),
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Follow;
