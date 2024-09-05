Introduction
------------

Bienvenue sur Plate Eyes ! Nous avons développé un logiciel de reconnaissance automatique des plaques d'immatriculation, pour optimiser la gestion des parkings. Notre solution associe une technologie avancée d'analyse d'images à une interface web pratique pour rendre le stationnement plus fluide et simple.

### **Fonctionnalités**

 - **Reconnaissance Automatique des Plaques** : Plate Eyes utilise une intéligence artificielle pour lire et interpréter les plaques d'immatriculation, permettant une gestion sans barrière des entrées et sorties du parking.
- **Interface Web pour le Paiement** : Les conducteurs peuvent facilement régler leurs frais de stationnement en ligne via une interface intuitive.
- **Gestion du Parking par une Interface Admin** :
Une page admin permet de voir les entrées et sortie, modifier les tarifs et rechercher les factures en suspens.

### Avantages de Plate Eyes
- Fluidité du Flux de Véhicules : Éliminez les files d'attente et les ralentissements avec un processus d'entrée et de sortie rapide.
- Réduction du Stress : Profitez d'une expérience de stationnement sans arrêts fréquents ni gestion de tickets.
- Efficacité Accrue : Accélérez les processus d’entrée et de sortie, réduisant ainsi la congestion et les temps d’attente.
- Sécurité Renforcée : Améliorez la sécurité en identifiant et en suivant les véhicules associés à des activités suspectes.
- Augmentation des Revenus : Optimisez l'application des règlements de stationnement et augmentez les revenus provenant des amendes.

Avec **Plate Eyes**, bénéficiez d'une gestion de parking moderne et efficace, pour une expérience sans stress.


Installation
------------

Pour configurer et exécuter ce projet, suivez les étapes ci-dessous :

### Prérequis

Assurez-vous d'avoir Docker installé sur votre machine.


### Démarrez Tous les services

- ###  **Utiliser Docker Compose**
    
    Placez-vous à la racine du projet et pour démarrer tous les services en utilisant le fichier `docker-compose.yml`, exécutez la commande suivante :
    
    ```bash
    docker compose up
    ```
    - Le frontend, le backend et la base de données seront alors lancés.
   
***
### Démarrez les services séparéments

      
- ###  **Le Frontend**
    
    Pour lancer le frontend exécutez la commande suivante :
    
    ```bash
    docker run -p 3000:3000 johanmikami/plate-eyes-frontend
    ```
    - Le frontend sera accessible sur http://localhost:3000.

- ###    **Le Backend**
      
    Pour lancer le backend, exécutez la commande suivante :
    
    ```bash
    docker run -p 5000:5000 johanmikami/plate-eyes-backend
    ```
    - Vous pourrez alors accéder au backend sur http://localhost:5000. 
         
    

- ###    **La Base de Données**
      
    Pour lancer la base de données PostgreSQL, exécutez la commande suivante :
    
    ```bash
    docker run -d -p 5432:5432 --name temp -e POSTGRESQL_USERNAME=pdg -e POSTGRESQL_PASSWORD=pdg -e POSTGRESQL_DATABASE=pdg_db -e POSTGRESQL_POSTGRES_PASSWORD=root jmuhlema/postgresql:16
    ```
  
    Cela démarrera un conteneur PostgreSQL et exposera la base de données sur le port `5432`. Vous pouvez utiliser les identifiants suivants pour vous connecter :

    *   **Nom d'utilisateur** : `pdg`
    *   **Mot de passe** : `pdg`
    *   **Nom de la base de données** : `pdg_db`
    *   **Mot de passe PostgreSQL root** : `root`
    
***

###    **Vérification**
  

Après avoir lancé les services, vérifiez que chaque service est bien en cours d'exécution :
    -   Le Frontend devrait être accessible via `http://localhost:3000`.
    -   Le Backend via `http://localhost:5000`.
    -   La base de données PostgreSQL sera sur `localhost:5432` et peut être vérifiée avec un outil comme **pgAdmin** ou en ligne de commande avec `psql`.

###  **Arrêter les conteneurs Docker**
  
    Pour arrêter les conteneurs Docker en cours d'exécution, utilisez la commande :
    ```bash
    docker stop $(docker ps -q)
    ```
    Ou, si vous utilisez Docker Compose :
    ```bash
    docker compose down
    ```

