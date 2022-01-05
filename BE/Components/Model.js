const mongoose = require("mongoose");

const allUsersSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    otherInformation: {
      designation: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
      },
      birthday: {
        type: String,
        default: "",
      },
      totalProfileViews: {
        type: Number,
        default: 0
      },
      address: {
        city: {
          type: String,
          default: "",
        },
        state: {
          type: String,
          default: "",
        },
        zip: {
          type: Number,
          default: 0,
        }
      },
    },
    groups:{
      type: Array,
      default: []
    },
    recents: {
      type: Array,
      default: []
    },
    subscriptions:{
      type: Array,
      default: []
    },
    friends: {
      type: Array,
      default: [],
    },
    notifications: {
      friendsRequest: {
        type: Array,
        default: [],
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const postsSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    imagesUrl: {
      type: Array,
      default: [],
    },
    postReactions: {
      likes: {
        type: Array,
        default: [],
      },
      dislikes: {
        type: Array,
        default: [],
      },
    },
    comments: {
      type: Array,
      default: [],
    },
    reports:{
      type: Array,
      default : []
    }
  },
  { timestamps: true, minimize: false, versionKey: false }
);

module.exports.Posts = mongoose.model("POST", postsSchema);
module.exports.User = mongoose.model("USER", allUsersSchema);
