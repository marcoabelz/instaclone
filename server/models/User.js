const { ObjectId } = require("mongodb");
const { database } = require("../config/mongoConnection");
const { GraphQLError } = require("graphql");
const { hashPassword } = require("../helpers/bcrypt");

class User {
  static async create(body) {
    try {
      const users = database.collection("users");
      body.password = hashPassword(body.password);
      const data = await users.insertOne(body);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findByUsername(body) {
    try {
      const user = database.collection("users");
      const data = await user.findOne({
        username: body.username,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findByEmail(body) {
    try {
      const user = database.collection("users");
      const data = await user.findOne({
        email: body.email,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findById(_id) {
    try {
      const users = database.collection("users");

      const data = await users
        .aggregate([
          {
            $match: {
              _id: new ObjectId(_id),
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "following",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "followingId",
                    foreignField: "_id",
                    as: "followingDetail",
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
                {
                  $unwind: {
                    path: "$followingDetail",
                  },
                },
                {
                  $project: {
                    "followingDetail._id": 0,
                    "followingDetail.name": 0,
                    "followingDetail.email": 0,
                    "followingDetail.password": 0,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "follower",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "followerId",
                    foreignField: "_id",
                    as: "followerDetail",
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
                {
                  $unwind: {
                    path: "$followerDetail",
                  },
                },
                {
                  $project: {
                    "followerDetail._id": 0,
                    "followerDetail.name": 0,
                    "followerDetail.email": 0,
                    "followerDetail.password": 0,
                  },
                },
              ],
            },
          },
          // {
          //   $project: {
          //     password: 0,
          //   },
          // },
        ])
        .toArray();
      // console.log(JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findOne(_id) {
    try {
      const users = database.collection("users");
      const data = await users.findOne({
        _id: new ObjectId(_id),
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async searchUserByUsername(username) {
    try {
      const users = database.collection("users");
      const data = await users
        .find({
          username: { $regex: new RegExp(username, "i") },
        })
        .toArray();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const users = database.collection("users");
      const data = await users.find().toArray();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = User;
