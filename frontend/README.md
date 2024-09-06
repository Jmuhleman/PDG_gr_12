# Frontend

Le frontend est un projet React, installé avec npm.
La partie frontend est séparée en deux parties, client et admin. Elles sont toutes les deux sur le même serveur web.

## Partie Client

La partie Client peut être utilisée avec ou sans compte. Une page d'accueil permet de choisir soit une plaque d'immatriculation pour accéder à ses factures ouvertes, soit de s'inscrire, d'ajouter toutes ses plaques et d'accéder à toutes ses factures.

Plan du site :

- / (homePage.jsx)
- /billingOverview (BillingOverview.jsx)
- /profile (Profile.jsx)
- /billingSuccess (PaymentSuccess.jsx)

## Partie Admin

La partie d'administration permet de gérer et de monitorer les parkings, cela prend en compte le changement de tarif, le monitoring des entrées et sorties et le visionnement des factures en suspens.

Plan:

- /admin (AdminHub.jsx)
- /admin/fares (Fares.jsx)
- /admin/log (LogInOut.jsx)
- /admin/byPlate (ByPlate.jsx)

## Authentification

L'authentification client et admin se fait à l'aide de JWT créé sur le backend.
Ce JWT contient l'id de l'utilisateur, si l'utilisateur est admin et la date d'expiration du token.
Les mots de passe sont hashés avec argon2 sur le backend.

## Démarrer l'application dans l'optique de développement

Ce projet a été créé avec [Create React App](https://github.com/facebook/create-react-app).
Nous utilisons le gestionnaire de paquets NPM.

### Installation

#### `npm install`

Installe les dépendances du projet pour pouvoir lancer l'app.

### Démarrage

Dans le répertoire du projet, vous pouvez exécuter :

### `npm start`

Exécute l'application en mode développement.
Ouvrez [http://localhost:3000](http://localhost:3000) pour le voir dans votre navigateur.

La page se rechargera automatiquement lorsque vous apportez des modifications.
Vous pouvez également voir les erreurs de lint dans la console.

### `npm test`

Lance le runner de tests en mode interactif.
Consultez la section sur [l'exécution des tests](https://facebook.github.io/create-react-app/docs/running-tests) pour plus d'informations.
