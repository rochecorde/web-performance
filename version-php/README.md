# Version PHP de Web Performance

Cette version conserve le site actuel et ajoute un endpoint PHP pour le formulaire. Elle est séparée de la version publiée sur GitHub Pages, qui ne peut pas exécuter PHP.

## E-mails du formulaire

Le serveur PHP utilise `mail()` et transmet chaque demande au destinataire principal ainsi qu'en copie au collègue. Le serveur d'hébergement doit autoriser et configurer l'envoi de courrier.

Avant mise en ligne, configure ces variables d'environnement dans le panneau de l'hébergeur :

- `WP_CONTACT_TO` : `backertwebmaster@gmail.com`
- `WP_CONTACT_CC` : `dev.kkhalilov@gmail.com`
- `WP_MAIL_FROM` : adresse d'envoi fournie par l'hébergeur, idéalement une adresse du domaine du site

Ne mets aucun mot de passe, jeton ou identifiant SMTP dans les fichiers du site ni dans GitHub. Certains hébergeurs exigent SMTP plutôt que `mail()` ; il faudra alors adapter l'envoi à leur service, sans exposer les identifiants.

## Déploiement

1. Choisir un hébergement compatible PHP (PHP 7.4 ou plus récent) et vérifier sa configuration e-mail.
2. Définir les trois variables d'environnement ci-dessus dans le panneau d'hébergement.
3. Téléverser le contenu de ce dossier dans le répertoire public de l'hébergement.
4. Tester le formulaire en vérifiant la réception par les deux destinataires, y compris les dossiers de courriers indésirables.

GitHub Pages ne traite pas `index.php` ni `contact.php` : ne remplace pas la version actuelle sur GitHub Pages par ce dossier en espérant que le formulaire PHP y fonctionne.
