'use strict';
const {
  Model
} = require('sequelize');
const { nodeEnv, } = require('../../config');
const moment = require("moment-timezone");
const { mysqlTimeFormat, } = require("../../utils/time");
module.exports = (sequelize, DataTypes) => {
  class chatUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
     * @param {number} chatID
     * @param {Array} userIDs
     * @return {boolean}
     */
    static async createChatUsers(chatID, userIDs) {
      try {
        for (const userID of userIDs) {
          await sequelize.query(
            `INSERT INTO ${this.getTableName()}(chatID, userID, createdAt, updatedAt)
              VALUES (:chatID, :userID, :createdAt, :updatedAt);`, 
            {
              replacements: {
                chatID,
                userID,
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
        }

        return true;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} authenticatedUserID 
     * @param {number} queryUserID 
     * @returns 
     */
    static async checkChatExists(authenticatedUserID, queryUserID) {
      let res = false;
      try {
        const authChatUsers = await sequelize.query(
          `SELECT *
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.userID=:authenticatedUserID
              AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`,
          {
            replacements: { authenticatedUserID, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        for (const chat of authChatUsers) {
          const chatWithQueryUser = await sequelize.query(
            `SELECT *
              FROM ${this.getTableName()}
              WHERE ${this.getTableName()}.chatID=:chatID
                AND ${this.getTableName()}.userID=:queryUserID
                AND ${this.getTableName()}.deletedAt IS NULL
              LIMIT 1`,
            {
              replacements: {
                chatID: chat.chatID,
                queryUserID,
              },
              type: sequelize.QueryTypes.SELECT,
            },
          );
          if (0 < chatWithQueryUser.length) {
            res = true;
            return res;
          }
        }
        return res;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return res;
      }
    }
  }
  chatUsers.init({
    chatID: {
      type: DataTypes.INTEGER
    },
    userID: {
      type: DataTypes.INTEGER,
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
    modelName: 'chatUsers',
    tableName: "chatUsers",
  });
  return chatUsers;
};