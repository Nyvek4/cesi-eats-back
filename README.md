# Cesi-Eats

Educational project.
In our 4th year of training at CESI engineering school we can select one option
We have choosen the option based on advanced web development.


## Authors

- [@nyvek4](https://github.com/Nyvek4)
- [@Tilogr](https://github.com/Tilogr)
- [@ARESSent](https://github.com/ARESSent)
- [@QuentinBriancon](https://github.com/QuentinBriancon)


![Logo](https://i.ibb.co/4dYC7Zh/cesi-eats.png)



## Getting started 

### Initialisation de la stack (make ou powershell)
#### Pour macOS/Linux :

```bash
make dev 
```

#### Pour Windows :

```powershell
./start.ps1
```

### Migration de la base de donnée

## Sequelize ->
Installation de cli sequelize :
```bash
npm install --save-dev sequelize-cli
```

Génération du fichier config et ou fichier de migration (Initialisation)
```bash
npx sequelize-cli init
npx sequelize-cli migration:generate --name create-users
```
**[MIGRATION]** -> après avoir renseigner le fichier de migration généré précedemment (***crée la table dans la bdd***)
```bash
npx sequelize-cli db:migrate
```


## Créé un réseau docker
```bash
docker network create ceats_network
```





## License

[MIT](https://choosealicense.com/licenses/mit/)


