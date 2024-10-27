const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,  
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    labClubName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    returnable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'inventory',
    timestamps: false,
});

module.exports = Inventory;
