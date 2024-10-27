const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./models');
const User = require('./models/user');
const Issue = require('./models/issue');
const Inventory = require('./models/inventory');

const userRoutes = require('./routes/user');
const inventoryRoutes = require('./routes/inventory');
const issueRoutes = require('./routes/issue');

const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Morgan to log HTTP requests
app.use(morgan('dev'));
app.use(bodyParser.json());


User.hasMany(Issue, { foreignKey: 'userId', as: 'Issues' });
Inventory.hasMany(Issue, { foreignKey: 'inventoryId', as: 'Issues' });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false, alter: true });
        console.log('Database synced!');
    } catch (err) {
        console.error('Error syncing database', err);
    }
};

app.use(cors());

app.use('/user', userRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/issue', issueRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Portal API is running!');
});

app.listen(PORT, async () => {
    await syncDatabase();  
    console.log(`Server running on port ${PORT}`);
});
