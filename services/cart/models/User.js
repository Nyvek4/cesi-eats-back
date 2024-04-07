const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config({ path:'.env'}); 
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres', 
});
const bcrypt = require('bcryptjs');

class User extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  firstname: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  birthdate: { type: DataTypes.DATEONLY, allowNull: false },
  address: { type: DataTypes.JSON, allowNull: true },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  userType: { type: DataTypes.STRING, defaultValue: 'customer' },
  lastLogin: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true, 
   hooks: {
     beforeSave: async (user) => {
      if (user.changed('password') && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
      }
     }
   }
});

module.exports = User;
