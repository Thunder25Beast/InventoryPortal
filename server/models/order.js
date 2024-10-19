'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Order.init({
    itemname: DataTypes.STRING,
    itemDesc: DataTypes.STRING,
    nameOfStudent: DataTypes.STRING,
    studentroll: DataTypes.STRING,
    year: DataTypes.INTEGER,
    issuedAt: DataTypes.DATE,
    dueDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
