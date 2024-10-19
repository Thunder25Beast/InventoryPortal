'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Student.init({
    rollNumber: DataTypes.STRING,
    name: DataTypes.STRING,
    department: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
  });

  return Student;
};
