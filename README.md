Installation
------------

Pour configurer et exécuter ce projet, suivez les étapes ci-dessous :

### Prérequis

Assurez-vous d'avoir Docker installé sur votre machine.

### Installation

1.  **Utiliser Docker Compose (tous les services)**
    
    Placez-vous à la racine du projet et pour démarrer tous les services en utilisant le fichier `docker-compose.yml`, exécutez la commande suivante :
    
    ```bash
    docker compose up
    ```
    - Le frontend, le backend et la base de données seront alors lancés.
      
2.  **Démarrer le Frontend seul (optionel)**
    
    Pour lancer le frontend exécutez la commande suivante :
    
    ```bash
    docker run -p 3000:3000 johanmikami/plate-eyes-frontend
    ```
   - Le frontend sera accessible sur http://localhost:3000.

3.  **Démarrer le Backend seul (optionel)**
      
    Pour lancer le backend, exécutez la commande suivante :
    
    ```bash
    docker run -p 5000:5000 johanmikami/plate-eyes-backend
    ```
    - Vous pourrez alors accéder au backend sur http://localhost:5000. 
         
    

4.  **Démarrer la Base de Données seule (optionel)**
      
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

5.    **Vérification**
  

*   Après avoir lancé les services, vérifiez que chaque service est bien en cours d'exécution :
    *   Le Frontend devrait être accessible via `http://localhost:3000`.
    *   Le Backend via `http://localhost:5000`.
    *   La base de données PostgreSQL sera sur `localhost:5432` et peut être vérifiée avec un outil comme **pgAdmin** ou en ligne de commande avec `psql`.

6.  **Arrêter les conteneurs Docker**
  
    Pour arrêter les conteneurs Docker en cours d'exécution, utilisez la commande :
    ```bash
    docker stop $(docker ps -q)
    ```
    Ou, si vous utilisez Docker Compose :
    ```bash
    docker compose down
    ```

