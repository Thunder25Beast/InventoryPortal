const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Inventory = require('./inventory');

const Issue = sequelize.define('Issue', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    itemId: {
        type: DataTypes.UUID,
        references: {
            model: Inventory,
            key: 'id',
        },
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    tableName: 'issues',
    timestamps: false,
});

Issue.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Issue.belongsTo(Inventory, { foreignKey: 'inventoryId', as: 'Inventory' });

module.exports = Issue;
