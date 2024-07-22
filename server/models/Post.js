const { ObjectId } = require("mongodb");
const { database } = require("../config/mongoConnection");

class Post {
  static async create(body) {
    try {
      const posts = database.collection("posts");
      body._id = new ObjectId(body._id);
      // body.authorId = 1;
      body.comments = [];
      body.likes = [];
      body.createdAt = body.updatedAt = new Date();
      // console.log(body, "model");
      const data = await posts.insertOne(body);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const posts = database.collection("posts");
      const data = await posts
        .aggregate([
          {
            $lookup:
              /**
               * from: The target collection.
               * localField: The local join field.
               * foreignField: The target join field.
               * as: The name for the results.
               * pipeline: Optional pipeline to run on the foreign collection.
               * let: Optional variables to use in the pipeline field stages.
               */
              {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                as: "author",
              },
          },
          {
            $unwind:
              /**
               * path: Path to the array field.
               * includeArrayIndex: Optional name for index.
               * preserveNullAndEmptyArrays: Optional
               *   toggle to unwind null and empty values.
               */
              {
                path: "$author",
              },
          },
          {
            $sort:
              /**
               * Provide any number of field/order pairs.
               */
              {
                createdAt: -1,
              },
          },
          {
            $project:
              /**
               * specifications: The fields to
               *   include or exclude.
               */
              {
                "author.password": 0,
              },
          },
          // {
          //   $sort: /**
          //  * Provide any number of field/order pairs.
          //  */
          // {
          //   field1: sortOrder
          // }
          // }
        ])
        .toArray();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findById(_id) {
    try {
      const posts = database.collection("posts");
      // const data = await posts.findOne({
      //   _id: new ObjectId(_id),
      // });
      const data = await posts
        .aggregate([
          {
            $match: {
              _id: new ObjectId(_id),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
            },
          },
          {
            $project: {
              "author.password": 0,
            },
          },
        ])
        .toArray();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async postsPerUser(userId) {
    try {
      console.log(userId);
      const posts = database.collection("posts");
      // const data = await posts.findOne({
      //   _id: new ObjectId(_id),
      // });
      const data = await posts
        .aggregate([
          {
            $match: {
              authorId: new ObjectId(userId),
            },
          },
        ])
        .toArray();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async insertComment(body, user) {
    try {
      const { postId, content } = body;
      const posts = database.collection("posts");

      const findPost = await posts.findOne({
        _id: new ObjectId(postId),
      });

      const newContent = {
        content: content,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await posts.updateOne({ _id: findPost._id }, { $push: { comments: newContent } });
      const updatedPost = await posts
        .aggregate([
          {
            $match: {
              _id: new ObjectId(postId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
            },
          },
          {
            $project: {
              "author.password": 0,
            },
          },
        ])
        .toArray();
      return updatedPost[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async insertLike(body, user) {
    try {
      const { postId } = body;
      const posts = database.collection("posts");
      const findPost = await posts.findOne({
        _id: new ObjectId(postId),
      });

      const newLike = {
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await posts.updateOne(
        { _id: findPost._id },
        {
          $push: {
            likes: newLike,
          },
        }
      );

      const updatedPost = await posts
        .aggregate([
          {
            $match: {
              _id: new ObjectId(postId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: {
              path: "$author",
            },
          },
          {
            $project: {
              "author.password": 0,
            },
          },
        ])
        .toArray();

      return updatedPost[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = Post;
