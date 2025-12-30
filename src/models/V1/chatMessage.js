'use strict';
const {
  Model
} = require('sequelize');
const moment = require("moment-timezone");
const {
  nodeEnv,
  appTimezone,
  appURL,
} = require('../../config');
const { defaultAvatarPath } = require('../../utils/file');
const { integerNumberRegex } = require('../../utils/regexes');
const { mysqlTimeFormat } = require('../../utils/time');
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
            ORDER BY ${this.getTableName()}.id ASC;`,
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

    static getCreateChatMessageError(chatID, content) {
      if (null === `${chatID}`.match(integerNumberRegex)) {
        return "Chat ID must be a whole number.";
      }
      if (undefined === content) {
        return "Message content is required.";
      } else if ("string" !== typeof content) {
        return "Message content must be a string.";
      } else if (0 === content.trim().length) {
        return "Message content cannot be empty.";
      } else if (content.trim().length > 500) {
        return "Message content cannot exceed 500 characters.";
      }
      return false;
    }

    /**
     * @param {number} chatID
     * @param {string} content
     * @returns {Object|false}
     */
    static getCreateChatMessageData(chatID, content) {
      const res = {
        chatID,
      };
      if (!content) {
        return false;
      }
      res.content = content.trim();
      return res;
    }

    /**
     * @param {number} userID
     * @param {number} chatID
     * @param {string} content
     * @returns {Object|false}
     */
    static async createChatMessage(
      userID,
      chatID,
      content,
    ) {
      try {
        const result = await sequelize.query(
          `INSERT INTO ${this.getTableName()}(senderID, chatID, content, createdAt, updatedAt)
            VALUES(:senderID, :chatID, :content, :createdAt, :updatedAt);`,
          {
            replacements: {
              chatID,
              content,
              senderID: userID,
              createdAt: moment().tz(appTimezone).format(mysqlTimeFormat),
              updatedAt: moment().tz(appTimezone).format(mysqlTimeFormat),
            },
            type: sequelize.QueryTypes.INSERT,
          },
        );

        return { chatMessageID: result[0] };
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
    }

    /**
     * @param {number} id
     * @returns {Object|false}
     */
    static async getChatMessage(id) {
      try {
        const result = await sequelize.query(
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
            WHERE ${this.getTableName()}.id=:id
              AND ${this.getTableName()}.deletedAt IS NULL;`,
          {
            replacements: { id, },
            type: sequelize.QueryTypes.SELECT,
          },
        );

        return this.getFormattedChatMessageData(result[0]);
      } catch(err) {
        if ("production" !== nodeEnv) {
          console.log(err);
        }
        return false;
      }
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