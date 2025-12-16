'use strict';
const moment = require("moment-timezone");
const { faker, } = require('@faker-js/faker');
const { mysqlTimeFormat, } = require("../../utils/time");
const { encrypt, } = require("../../utils/tokens");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const fakeUsers = [];
      let pwd;

      pwd = encrypt("secret");
      fakeUsers.push({
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })

      pwd = encrypt("secret");
      fakeUsers.push({
        email: "james@example.com",
        firstName: "James",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })

      pwd = encrypt("secret");
      fakeUsers.push({
        email: "joanna@example.com",
        firstName: "Joanna",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })

      pwd = encrypt("secret");
      fakeUsers.push({
        email: "juliet@example.com",
        firstName: "Juliet",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })
      
      pwd = encrypt("secret");
      fakeUsers.push({
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Doe",
        password: pwd.hash,
        passwordSalt: pwd.salt,
        createdAt: moment()
          .utc()
          .format(mysqlTimeFormat),
        updatedAt: moment()
          .utc()
          .format(mysqlTimeFormat),
      })

      await queryInterface.bulkInsert('users', [
        ...fakeUsers,
      ], { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('users', null, { transaction, });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
