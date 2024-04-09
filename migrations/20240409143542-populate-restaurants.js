'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    async function hashPassword(password) {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }

    const restaurants = [
      {
        firstname: "Chez Jo",
        lastname: "Chez Jo",
        email: "contact@chezjo.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street":"Rue d'Italie","Number":"15","City":"Aix-en-Provence","ZipCode":"13100"}),
        password: await hashPassword('restau') // Remplacer par le mot de passe haché réel
      },
      {
        firstname: "La Pizza",
        lastname: "La Pizza",
        email: "info@lapizza.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street":"Rue de la Verrerie","Number":"2","City":"Aix-en-Provence","ZipCode":"13100"}),
        password: await hashPassword('restau')
      },
      // Restaurants ajoutés
      {
        firstname: "Le Provence",
        lastname: "Le Provence",
        email: "contact@leprovence.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street":"Cours Mirabeau","Number":"10","City":"Aix-en-Provence","ZipCode":"13100"}),
        password: await hashPassword('restau')
      },
      {
        firstname: "Le Petit Verdot", 
        "lastname": "Le Petit Verdot", 
        "email": "contact@lepetitverdot.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Rue d'Entrecasteaux", "Number": "10", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: await hashPassword('restau')
      },
      {
        firstname: "L'Épicurien", "lastname": "L'Épicurien", "email": "contact@lepicurien.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Place des Cardeurs", "Number": "7", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: await hashPassword('restau')
      },
      {
        firstname: "Mitch", "lastname": "Mitch", "email": "contact@mitch.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Rue des Tanneurs", "Number": "26", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: await hashPassword('restau')
      },
      {
        firstname: "La Table du Roi", "lastname": "La Table du Roi", "email": "contact@latableduroi.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Rue des Remparts", "Number": "32", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: await hashPassword('restau')
      },
      {
        firstname: "Le Goût des Mets",
        lastname: "Le Goût des Mets",
        email: "goutdesmets@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Rue d'Italie", "Number": "27", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: 'restau'
      },
      {
        firstname: "Chez Antoine",
        lastname: "Chez Antoine",
        email: "chezantoine@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Cours Mirabeau", "Number": "58", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: 'restau'
      },
      {
        firstname: "Les Terrasses",
        lastname: "Les Terrasses",
        email: "leterrasses@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Avenue des Belges", "Number": "4", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: 'restau'
      },
      {
        firstname: "La Rotonde",
        lastname: "La Rotonde",
        email: "larotonde@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({"Street": "Place Jeanne d'Arc", "Number": "11", "City": "Aix-en-Provence", "ZipCode": "13100" }),
        password: 'restau'
      }
    ];

    // Hasher les mots de passe
    for (const restaurant of restaurants) {
      restaurant.password = await hashPassword(restaurant.password);
    }

    // Insérer les données dans la table
    await queryInterface.bulkInsert('Users', restaurants);
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer les données insérées lors du rollback
    // await queryInterface.bulkDelete('Users', null, {});
  }
};
