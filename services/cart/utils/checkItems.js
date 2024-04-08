const Article = require('../models/Article');

const checkItems = async (Items) => {
try {
    try {
      const articles = await Promise.all(Items.map(async (articleId) => {
        const article = await Article.findByPk(articleId);
        if (!article) {
          throw new Error("Article not found");
        }
      }));
      
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