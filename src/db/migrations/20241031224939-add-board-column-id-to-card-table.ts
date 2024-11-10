'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "cards",
      "board_column_id",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "board_columns",
          key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      }
    )
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("cards", "board_column_id")
  }
};
