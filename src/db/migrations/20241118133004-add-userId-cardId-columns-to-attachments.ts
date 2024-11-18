'use strict';

import { DataTypes, QueryInterface, Transaction } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((t: Transaction) => {
      return Promise.all([
        queryInterface.addColumn(
          "attachments",
          "card_id",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "cards",
              key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          },
          {transaction: t}
        ),

        queryInterface.addColumn(
          "attachments",
          "user_id",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          },
          {transaction: t}
        ),

        queryInterface.addIndex(
          "attachments",
          ["card_id"],
          {
            name: "attachments_card_id_idx",
            transaction: t
          }
        )
      ])
    })
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((t: Transaction) => {
      return Promise.all([
        queryInterface.removeColumn("attachments", "card_id", { transaction: t }),
        queryInterface.removeColumn("attachments", "user_id", { transaction: t }),
        queryInterface.removeIndex("attachments", "attachments_card_id_idx", { transaction: t })
      ])
    })
  }
};
