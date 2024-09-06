Introduction
------------

Bienvenue sur PLATE EYES ! Nous avons développé un système de reconnaissance automatique des plaques d'immatriculation, pour optimiser la gestion des parkings et leur flux de véhicules. Notre solution associe une technologie avancée d'analyse d'images à une interface web pratique pour un stationnement plus fluide et plus simple.

### **Fonctionnalités**

 - **Reconnaissance Automatique des Plaques** : 
 PLATE EYES utilise un module d'intelligence artificielle basée sur l'apprentissage automatique pour reconnaître et lire les plaques d'immatriculation, permettant ainsi une gestion sans barrière des sorties de parking.
- **Interface Web pour le Paiement** : 
Les conducteurs peuvent facilement régler leurs frais de stationnement en ligne (via Stripe) via une interface utilisateur intuitive.
- **Gestion du Parking par une Interface Admin** : 
Une interface administrateur permet de consulter les entrées et sorties, modifier les tarifs et rechercher les factures en suspens.

### Avantages de PLATE EYES
- **Fluidité du Flux de Véhicules** : Éliminez les files d'attente et les ralentissements aux entrées et sorties de vos garages
- **Réduction du Stress** : Offrez une expérience de stationnement agréable aux utilisateurs, sans arrêts fréquents ni gestion de tickets.
- **Efficacité Accrue** : Accélérez les processus d’entrée et de sortie, en réduisant ainsi la congestion et les temps d’attente.
- **Sécurité Renforcée** : Améliorez la sécurité en identifiant et en suivant les véhicules associés à des activités suspectes.

Avec **PLATE EYES**, bénéficiez d'une gestion de parking moderne et efficace, pour une expérience sans stress.


Installation
------------

Pour configurer et exécuter ce projet, suivez les étapes ci-dessous :

### Prérequis

Assurez-vous que Docker est installé sur votre machine.

### Démarrer tous les services

- ###  **Utiliser Docker Compose**
    
    Placez-vous à la racine du projet, et démarrez tous les services en utilisant le fichier `docker-compose.yml` en exécutant la commande suivante :
    
    ```bash
    docker compose up
    ```
    Le frontend, le backend et la base de données seront alors téléchargées et lancés. Notez que le téléchargement peut prendre du temps.
   
***
### Démarrer les services séparément

      
- ###  **Frontend**
    
    Pour lancer le frontend exécutez la commande suivante :
    
    ```bash
    docker run -p 3000:3000 johanmikami/plate-eyes-frontend:latest
    ```
    Le container du frontend sera téléchargé et accessible à l'adresse http://localhost:3000.

- ###    **Backend**
      
    Pour lancer le backend, exécutez la commande suivante :
    
    ```bash
    docker run -p 5000:5000 johanmikami/plate-eyes-backend
    ```
    Le téléchargement peut prendre du temps

- ###    **Base de Données**
      
    Pour lancer la base de données PostgreSQL, exécutez la commande suivante :
    
    ```bash
    docker run -d -p 5432:5432 --name temp -e POSTGRESQL_USERNAME=pdg -e POSTGRESQL_PASSWORD=pdg -e POSTGRESQL_DATABASE=pdg_db -e POSTGRESQL_POSTGRES_PASSWORD=root jmuhlema/postgresql:16
    ```
    Cela démarrera un conteneur PostgreSQL et exposera la base de données sur le port `5432`. 
    
    Les identifiants suivants permettent de se connecter à la base de données :

    *   **Nom d'utilisateur** : `pdg`
    *   **Mot de passe** : `pdg`
    *   **Nom de la base de données** : `pdg_db`
    *   **Mot de passe PostgreSQL root** : `root`
    
***

###    **Vérification**
  

Après avoir lancé les services, vérifiez que chaque service est bien en cours d'exécution :

-   Le Frontend devrait être accessible sur `http://localhost:3000`.
-   La base de données PostgreSQL devrait être accessible sur `localhost:5432` via un outil comme `pgAdmin` ou en ligne de commande avec `psql`.

###  **Arrêter les conteneurs Docker**
  
Pour arrêter les conteneurs Docker en cours d'exécution, utilisez la commande :
```bash
docker stop $(docker ps -q)
```
Ou, si vous utilisez Docker Compose :
```bash
docker compose down
```

