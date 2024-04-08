const User = require('./User');
const Article = require('./Article');
const Category = require('./Category');

const defineAssociations = () => {
  User.hasMany(Article, { foreignKey: 'userId' });
  Article.belongsTo(User, { foreignKey: 'userId' });
  Category.hasMany(Article, { foreignKey: 'categorieId' });
  Article.belongsTo(Category, { foreignKey: 'categorieId' });
};

module.exports = defineAssociations;