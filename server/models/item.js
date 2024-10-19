'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // define associations here
    }
  }

  Item.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    quantityTotal: DataTypes.STRING,
    quantityAvailable: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Item',
  });

  return Item;
};
