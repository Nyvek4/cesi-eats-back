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
        address: JSON.stringify({
          "Work": {"Street": "Rue d'Italie", "Number": "15", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau' // Le hashage devrait être géré séparément
      },
      {
        firstname: "La Pizza",
        lastname: "La Pizza",
        email: "info@lapizza.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue de la Verrerie", "Number": "2", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Le Provence",
        lastname: "Le Provence",
        email: "contact@leprovence.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Cours Mirabeau", "Number": "10", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Le Petit Verdot",
        lastname: "Le Petit Verdot",
        email: "contact@lepetitverdot.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue d'Entrecasteaux", "Number": "10", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "L'Épicurien",
        lastname: "L'Épicurien",
        email: "contact@lepicurien.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Place des Cardeurs", "Number": "7", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Mitch",
        lastname: "Mitch",
        email: "contact@mitch.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue des Tanneurs", "Number": "26", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "La Table du Roi",
        lastname: "La Table du Roi",
        email: "contact@latableduroi.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue des Remparts", "Number": "32", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Le Goût des Mets",
        lastname: "Le Goût des Mets",
        email: "goutdesmets@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue d'Italie", "Number": "27", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Chez Antoine",
        lastname: "Chez Antoine",
        email: "chezantoine@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Cours Mirabeau", "Number": "58", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Les Terrasses",
        lastname: "Les Terrasses",
        email: "leterrasses@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Avenue des Belges", "Number": "4", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "La Rotonde",
        lastname: "La Rotonde",
        email: "larotonde@aix.fr",
        userType: "restaurant",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Place Jeanne d'Arc", "Number": "11", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Antoine",
        lastname: "Millau",
        email: "antoinem13290@outlook.fr",
        userType: "delivery",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Rue de l'école", "Number": "76", "City": "Aix-en-Provence", "ZipCode": "13290"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Robien",
        lastname: "Hatier",
        email: "rhatier@outlook.fr",
        userType: "delivery",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Avenue des Belges", "Number": "22", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },
      {
        firstname: "Mathis",
        lastname: "Michel",
        email: "michelmat@outlook.fr",
        userType: "delivery",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "Place Jeanne d'Arc", "Number": "11", "City": "Aix-en-Provence", "ZipCode": "13100"},
          "Home": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"}
        }),
        password: 'restau'
      },  {
        firstname: "Alice",
        lastname: "Dubois",
        email: "alice.dubois@outlook.com",
        userType: "customer",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"},
          "Home": {"Street": "Avenue Saint-Victoire", "Number": "47", "City": "Aix-en-Provence", "ZipCode": "13100"}
        }),
        password: 'customer' // Ce mot de passe doit être hashé lors de l'insertion réelle dans la base de données
      },
      {
        firstname: "Julien",
        lastname: "Martin",
        email: "julien.martin@outlook.com",
        userType: "customer",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"},
          "Home": {"Street": "Boulevard de la République", "Number": "29", "City": "Aix-en-Provence", "ZipCode": "13100"}
        }),
        password: 'customer'
      },
      {
        firstname: "Sophie",
        lastname: "Leroy",
        email: "sophie.leroy@outlook.com",
        userType: "customer",
        birthdate: new Date(),
        address: JSON.stringify({
          "Work": {"Street": "N/A", "Number": "N/A", "City": "N/A", "ZipCode": "N/A"},
          "Home": {"Street": "Rue Mignet", "Number": "21", "City": "Aix-en-Provence", "ZipCode": "13100"}
        }),
        password: 'customer'
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
