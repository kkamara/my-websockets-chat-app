'use strict';
const {
  Model
} = require('sequelize');
const moment = require("moment-timezone");
const { mysqlTimeFormat, } = require("../../utils/time");
const { nodeEnv, appTimezone, } = require('../../config');
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
     * @returns {boolean}
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

    /**
     * @param {number} chatID
     * @param {number} excludingUserID
     * @returns {Object|false}
     */
    static async getChatUserNotByUserID(chatID, excludingUserID) {
      try {
        const result = await sequelize.query(
          `SELECT ${this.getTableName()}.id AS chatUserID, ${this.getTableName()}.chatID,
              ${this.getTableName()}.userID, ${this.getTableName()}.createdAt,
              ${this.getTableName()}.updatedAt, ${sequelize.models.user.getTableName()}.firstName,
              ${sequelize.models.user.getTableName()}.lastName, ${sequelize.models.user.getTableName()}.email
            FROM ${this.getTableName()}
            LEFT JOIN ${sequelize.models.user.getTableName()}
              ON ${this.getTableName()}.userID=${sequelize.models.user.getTableName()}.id
            WHERE ${this.getTableName()}.chatID=:chatID
              AND ${this.getTableName()}.userID != :excludingUserID
              AND ${this.getTableName()}.deletedAt IS NULL
            LIMIT 1`,
          {
            replacements: { chatID, excludingUserID, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        return result[0];
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {Object} payload 
     * @returns {Object}
     */
    static getFormattedChatUserData(payload) {
      const res = {
        chatID: payload.chatID,
        userID: payload.userID,
        createdAt: moment(payload.createdAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
        updatedAt: moment(payload.updatedAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
      };
      if (payload.firstName) {
        res.firstName = payload.firstName;
      }
      if (payload.lastName) {
        res.lastName = payload.lastName;
      }
      if (payload.email) {
        res.email = payload.email;
      }
      return res;
    }

    /**
     * @param {Array} payload
     * @return {Array}
     */
    static getFormattedChatUsersData(payload) {
      const formattedChatList = [];
      for (const chatUser of payload) {
        formattedChatList.push(this.getFormattedChatUserData(chatUser));
      }
      return formattedChatList;
    }

    /**
     * @param {number} chatID
     * @param {number} excludingUserID
     * @returns {Object|false}
     */
    static async getChatUsersNotByUserID(chatID, excludingUserID) {
      try {
        const results = await sequelize.query(
          `SELECT ${this.getTableName()}.id AS chatUserID, ${this.getTableName()}.chatID,
              ${this.getTableName()}.userID, ${this.getTableName()}.createdAt,
              ${this.getTableName()}.updatedAt
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.chatID=:chatID
              AND ${this.getTableName()}.userID != :excludingUserID
              AND ${this.getTableName()}.deletedAt IS NULL`,
          {
            replacements: { chatID, excludingUserID, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        return results;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} chatID
     * @returns {Object|false}
     */
    static async getChatUsers(chatID) {
      try {
        const results = await sequelize.query(
          `SELECT ${this.getTableName()}.id AS chatUserID, ${this.getTableName()}.chatID,
              ${this.getTableName()}.userID, ${this.getTableName()}.createdAt,
              ${this.getTableName()}.updatedAt
            FROM ${this.getTableName()}
            WHERE ${this.getTableName()}.chatID=:chatID
              AND ${this.getTableName()}.deletedAt IS NULL`,
          {
            replacements: { chatID, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        return results;
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
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