# Contribuer au projet Plate Eyes

## Présentation du projet

**Plate Eyes** est un logiciel avec une interface web conçu pour scanner les plaques d'immatriculation afin de simplifier le stationnement et d'éliminer les barrières physiques. Le projet inclut également une fonctionnalité de paiement via Stripe prenant en charges divers moyens de paiement commme les cartes de crédits et Twint. Le projet est développé en utilisant Flask et Python pour le backend (notamment pour l'intelligence artificielle), React pour le frontend, et Docker pour la conteneurisation.

## Types de contributions recherchées

Nous accueillons les contributions dans les domaines suivants :
- **Code** : Amélioration des fonctionnalités existantes, correction de bugs, optimisation du système de reconnaissance des plaques.
- **Documentation** : Amélioration et mise à jour de la documentation existante.

### Domaines prioritaires

Nous rencontrons actuellement des difficultés avec la reconnaissance des plaques européennes en raison de difficulté à lire le cigle du pays. Nous aurions besoin de développer notre propre ensemble de données d'entraînement au lieu d'utiliser un modèle pré-entraîné pour le rendre moins vulnérable au pixel attack et pour véritablement controller l'architecture de notre AI. Toute contribution dans ces domaines seraient particulièrement appréciée.

## Processus de Contribution

### 1. Prise de contact

Avant de commencer, veuillez nous contacter en ouvrant une issue sur le dépôt GitHub pour discuter de la modification que vous souhaitez apporter. Cela nous permettra de mieux coordonner les efforts et de vous guider si nécessaire.

### 2. Fork et création d'une branche

Une fois votre proposition acceptée, veuillez :
- **Forker** le dépôt.
- Créer une **nouvelle branche** à partir de `develop`.

### 3. Soumission d'une Pull Request

- Assurez-vous que votre Pull Request est dirigée vers la branche `develop`.
- Veuillez **mettre à jour la documentation** (notamment le fichier `README.md`) pour refléter les changements, y compris les nouvelles dépendances ou les étapes d'installation.
- N'oubliez pas de **mettre à jour les versions** dans le fichier `requirements.txt` et tout autre fichier pertinent.
- Si possible, **soumettez des tests** pour valider vos modifications. Nous encourageons fortement l'ajout de tests supplémentaires pour améliorer la couverture de notre code.

### 4. Revue et Fusion

Les Pull Requests seront examinées par l'équipe. Vous recevrez un retour pour d'éventuelles modifications. Une fois approuvée, nous procéderons à la fusion sur la branche `develop`, puis nous gérerons nous-mêmes la fusion vers la branche `main`.

## Communication

Pour toute question ou discussion, veuillez utiliser l'**issue tracker** de GitHub. Cela nous permet de centraliser les échanges et de garantir que toutes les questions sont traitées.

## Reconnaissance des Contributeurs

Les contributeurs verront leur nom ajouté sur la page d'accueil du projet en signe de reconnaissance.

## Code de Conduite

Nous n'avons pas encore de code de conduite formel, mais nous vous demandons de respecter les normes de communication professionnelle et courtoise dans toutes vos interactions avec le projet. Si vous pensez qu'un code de conduite est nécessaire, n'hésitez pas à proposer un modèle adapté.

## Informations supplémentaires

Nous sommes un groupe d'étudiants francophones, et bien que ce projet soit à usage académique, nous accueillons toutes les contributions qui pourraient améliorer Plate Eyes.

Pour plus d'informations sur l'installation et la configuration du projet, veuillez consulter la documentation incluse dans ce dépôt, ainsi que les rapports que nous avons rédigés pour nos enseignants.
