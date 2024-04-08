const User = require('./User');
const Article = require('./Article');
const Menu = require('./Menu')
const Category = require('./Category');

const defineAssociations = () => {
  User.hasMany(Article, { foreignKey: 'userId' });
  Article.belongsTo(User, { foreignKey: 'userId' });
  Category.hasMany(Article, { foreignKey: 'categoryId' }); // Modifier le nom de la clé étrangère en 'categoryId'
  Article.belongsTo(Category, { foreignKey: 'categoryId' });
  Menu.belongsTo(User, { foreignKey: 'restaurantId' }); // Changer le nom de la clé étrangère en 'restaurantId'
  Menu.hasMany(Article); // Laisser la relation entre Menu et Article telle quelle
};

module.exports = defineAssociations;