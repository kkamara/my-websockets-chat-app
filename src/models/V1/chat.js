'use strict';
const {
  Model
} = require('sequelize');
const { nodeEnv, } = require('../../config');
const { integerNumberRegex, } = require("../../utils/regexes");
const moment = require("moment-timezone");
const { mysqlTimeFormat, } = require("../../utils/time");
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
     * @param {Array} userIDs
     * @return {Object|boolean}
     */
    static async createChat(userIDs) {
      try {
        const results = await sequelize.query(
          `INSERT INTO ${this.getTableName()}(isGroupChat, createdAt, updatedAt)
            VALUES (false, :createdAt, :updatedAt);`, 
          {
            replacements: {
              createdAt: moment()
                .utc()
                .format(mysqlTimeFormat),
              updatedAt: moment()
                .utc()
                .format(mysqlTimeFormat),
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );

        const createChatUsers = await sequelize.models.chatUsers.createChatUsers(
          results[0],
          userIDs,
        );
        if (false === createChatUsers) {
          return false;
        }

        return { chatID: results[0] };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {Object} bodyInput
     * @return {false|string}
     */
    static async getCreateChatError(bodyInput) {
      if (undefined === bodyInput.userID) {
        return "User ID is required.";
      } else if (
        Array.isArray(bodyInput.userID) ||
        null === `${bodyInput.userID}`.match(integerNumberRegex)
      ) {
        return "User ID must be a whole number.";
      } else {
        const user = await sequelize
          .models
          .user
          .getUser(bodyInput.userID);
        if (false === user) {
          return `User with ID ${bodyInput.userID} does not exist.`;
        }
      }
      return false;
    }

    /**
     * @param {number} userID
     * @return {Object|false}
     */
    static getCleanCreateChatData(userID) {
      if (!userID) {
        return false;
      }
      return {
        userID,
      };
    }
  }
  chat.init({
    chatName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'chat',
    tableName: "chats",
  });
  return chat;
};