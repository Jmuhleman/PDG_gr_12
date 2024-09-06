# Contribuer au projet Plate Eyes

## Présentation du projet

**Plate Eyes** est un logiciel avec une interface web conçu pour scanner les plaques d'immatriculation afin de simplifier le stationnement et d'éliminer les barrières physiques. Le projet inclut également une fonctionnalité de paiement via Stripe avec divers moyens de paiement (cartes de crédits et Twint). Le projet est développé en utilisant Flask et Python pour le backend, React pour le frontend, et Docker pour la conteneurisation.

## Types de contributions recherchées

Nous accueillons volontiers les contributions dans les domaines suivants :
- **Code** : Amélioration des fonctionnalités existantes, correction de bugs, optimisation du système de reconnaissance des plaques.
- **Documentation** : Amélioration et mise à jour de la documentation existante.

### Domaines prioritaires

Nous rencontrons actuellement des difficultés avec la reconnaissance des plaques en raison de problèmes de contraste, de luminosité, et d'orientation de la plaque par rapport à la caméra. Nous avons également des difficultés avec les plaques européennes et la difficulté à lire les lettres identifiant le pays. Nous aurions besoin de développer notre propre ensemble de données d'entraînement pour rendre notre réseau de neurones plus robuste et pour véritablement contrôler son architecture. Toute contribution dans ces domaines serait particulièrement appréciée.

## Processus de Contribution

### 1. Prise de contact

Avant de commencer, merci de bien vouloir nous contacter en ouvrant une *issue* sur le dépôt GitHub pour discuter de la modification que vous souhaitez apporter. Cela nous permettra de mieux coordonner les efforts et de vous guider si nécessaire.

### 2. Fork et création d'une branche

Une fois votre proposition acceptée, veuillez :
- **forker** le dépôt, et
- créer une **nouvelle branche** à partir de `develop` intitulée *feat_<fonctionnalité>*

### 3. Soumission d'une Pull Request

- Assurez-vous que votre Pull Request est dirigée vers la branche `develop`.
- Veuillez **mettre à jour la documentation** (notamment le fichier `README.md`) pour refléter les changements, y compris les nouvelles dépendances ou les étapes d'installation.
- Veuillez **mettre à jour les versions** dans le fichier `requirements.txt` et tout autre fichier pertinent.
- Si possible, **soumettez des tests** pour valider vos modifications. Nous encourageons fortement l'ajout de tests supplémentaires pour améliorer la couverture de notre code.

### 4. Revue et Fusion

Les Pull Requests seront examinées par l'équipe. Vous recevrez un retour pour d'éventuelles modifications. Une fois approuvées, nous procéderons à la fusion sur la branche `develop`, puis nous gérerons nous-mêmes la fusion vers la branche `main`.

## Communication

Pour toute question ou discussion, veuillez utiliser l'**issue tracker** de GitHub. Cela nous permet de centraliser les échanges et de garantir que toutes les questions sont traitées.

## Reconnaissance des Contributeurs

Les contributeurs verront leurs noms ajoutés sur la page d'accueil du projet.

## Code de Conduite

Nous n'avons pas encore de code de conduite formel, mais nous vous demandons de respecter les normes de communication professionnelle et courtoise dans toutes vos interactions avec le projet. Si vous pensez qu'un code de conduite est nécessaire, n'hésitez pas à proposer un modèle adapté.

## Informations supplémentaires

Pour plus d'informations sur l'installation et la configuration du projet, veuillez consulter la documentation incluse dans ce dépôt, ainsi que les rapports que nous avons rédigés.