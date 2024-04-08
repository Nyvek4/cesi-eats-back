
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.POSTGRES_URI);

class Categorie extends Model {}

Categorie.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true, // suppose que le champ photo est optionnel
  },
}, {
  sequelize,
  modelName: 'Categorie',
});

module.exports = Categorie;
