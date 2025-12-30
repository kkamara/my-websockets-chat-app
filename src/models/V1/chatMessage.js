'use strict';
const {
  Model
} = require('sequelize');
const { nodeEnv, } = require('../../config');
const { defaultAvatarPath } = require('../../utils/file');
module.exports = (sequelize, DataTypes) => {
  class chatMessage extends Model {
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
     * @returns {Object|false}
     */
    static async getChatMessages(chatID) {
      try {
        const results = await sequelize.query(
          `SELECT ${this.getTableName()}.id AS chatMessageID, ${this.getTableName()}.senderID,
              ${this.getTableName()}.content, ${this.getTableName()}.chatID,
              ${this.getTableName()}.createdAt, ${this.getTableName()}.updatedAt,
              ${sequelize.models.user.getTableName()}.firstName, ${sequelize.models.user.getTableName()}.lastName,
              ${sequelize.models.user.getTableName()}.email, ${sequelize.models.user.getTableName()}.avatarName
            FROM ${this.getTableName()}
            RIGHT JOIN ${sequelize.models.chat.getTableName()}
              ON ${sequelize.models.chat.getTableName()}.id = ${this.getTableName()}.chatID
            RIGHT JOIN ${sequelize.models.user.getTableName()}
              ON ${sequelize.models.user.getTableName()}.id = ${this.getTableName()}.senderID
            WHERE ${this.getTableName()}.chatID=:chatID
              AND ${this.getTableName()}.deletedAt IS NULL
            ORDER BY ${this.getTableName()}.createdAt ASC;`,
          {
            replacements: { chatID, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        return this.getFormattedChatMessagesData(results);
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {array} payload
     * @returns {array}
     */
    static getFormattedChatMessagesData(payload) {
      const result = [];
      for (const item of payload) {
        result.push(
          this.getFormattedChatMessageData(item)
        );
      }
      return result;
    }

    /**
     * @param {Object} data
     * @returns {Object}
     */
    static getFormattedChatMessageData(data) {
      return {
        id: data.chatMessageID,
        content: data.content,
        chatID: data.chatID,
        sender: {
          id: data.senderID,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatarPath: data.avatarName ?
            appURL+"/images/profile/"+data.avatarName :
            defaultAvatarPath,
        },
        createdAt: moment(data.createdAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
        updatedAt: moment(data.updatedAt)
          .tz(appTimezone)
          .format(mysqlTimeFormat),
      };
    }
  }
  chatMessage.init({
    senderID: {
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.TEXT
    },
    chatID: {
      type: DataTypes.INTEGER
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
    modelName: 'chatMessage',
    tableName: "chatMessages",
  });
  return chatMessage;
};