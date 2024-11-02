# Indices Universcape

Création d'une application d'indiçage pour Universcape.
L'objectif est d'avoir un chat entre les joueurs et le GM, et également que le GM puisse envoyer des images et vidéos qui soient joués sur l'écran des joueurs.
Les contraintes sont donc les suivantes :

- Création d'une page dédiée aux joueurs où recevoir les messages envoyés depuis l'interface GM
  - Visuel personnalisé
  - Input pour rentrer les messages
  - Affichage des messages du GM
  - Auto-focus sur l'input
  - Impossibilité de faire des combinaisons de touches (tab, ctrl, alt, ...)
  - Affichage d'images et de vidéos
  - Animation d'attente de réponse du GM
- Création d'une page d'interface GM où on peut :
  - Envoyer des messages écrits
  - Recevoir des messages des joueurs
  - Cliquer sur des boutons pour envoyer des images/vidéos, voir des indices pré-écrits

## Comment lancer l'application ?

- Cloner le code depuis le repo git
- Se rendre dans le dossier cloné
- La première fois, ou après ajout d'un nouveau packager, lancer la commande `npm install`
- Une fois l'installation terminée, lancer `npm run dev`
- Dans un autre terminal, se rendre dans le dossier backend et lancer `npm install` la première fois puis `npm start`

## Ajouter des boutons d'indice

Pour ajouter des boutons d'indices, il faut modifier le fichier `commands.json` situé dans le dosser `src/assets`.
Tout d'abord, chaque bouton se trouve dans une partie nommée `step`. Il est tout à fait possible d'ajouter une nouvelle partie en copiant le code ci-dessous :

```json
{
    "step": "3",
    "step_name": "Troisième partie",
    "buttons": []
},
```

C'est ensuite dans la partie `buttons` que l'on va pouvoir ajouter de nouveau boutons.
Il y a une spécificité pour les boutons de type bypass, sinon la majorité des boutons sera à ajouter dans le tableau (entre les crochets) de la partie buttons, en ajoutant un code de la forme suivante :

```json
{
        "name": "Nom affiché sur le bouton ",
        "type": "sound",
        "description": "Description qui s'affichera au dessus du bouton",
        "src": "chemin/vers/le/fichier"
      },
```

Il existe pour le moment 4 types de boutons :

- `bypass`
- `sound`
- `image`
- `video`

## Evolutions possibles

- Pour le message de chargement, ajouter des textes dans un tableau et piocher dedans aléatoirement pour le message à afficher
  - Il est également possible de changer le message afficher à différentes intervales de temps
- Pouvoir générer les boutons d'images/vidéos à envoyer à la volée
