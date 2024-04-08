const Article = require('../models/Article');
const Menu = require('../models/Menu');

const checkItems = async (Items) => {
try {
    try {
      const articles = await Promise.all(Items.map(async (itemId) => {
        const article = await Article.findByPk(itemId);
        if (!article) {
          const menu = await Menu.findByPk(itemId);
          if (!menu) {
            throw new Error("Article or Menu not found");
        }
      }}));
      
      return true
    } catch (error) {
        console.error(error);
        return false
    }
} catch (error) {
    console.error(error);
    return false
}
}

module.exports = checkItems;