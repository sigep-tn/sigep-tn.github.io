# SIGEP — site vitrine

Site de **SIGEP**, installation photovoltaïque, pompage solaire et chauffe-eau solaires en Tunisie.

- Français : <https://sigep-tn.github.io/>
- Arabe : <https://sigep-tn.github.io/ar/>

Site statique en HTML, CSS et JavaScript, sans framework : le dossier se publie tel quel.

## Mettre en ligne sur GitHub Pages

1. Créer un compte GitHub nommé **`sigep-tn`**, puis un dépôt public nommé **`sigep-tn.github.io`**.
2. Envoyer le **contenu** de ce dossier à la racine du dépôt :

   ```bash
   cd D:/SIGEP_V2/site_web_sigep/site
   git init -b main
   git add .
   git commit -m "Site SIGEP"
   git remote add origin https://github.com/sigep-tn/sigep-tn.github.io.git
   git push -u origin main
   ```

3. Dans le dépôt : **Settings › Pages**, source **Deploy from a branch**, branche **`main`**, dossier **`/ (root)`**.
4. Le site est en ligne après quelques minutes. Chaque `git push` le met à jour.

Pour changer de nom de compte, changer l'adresse dans `../outils/donnees.py` (variable `SITE`) puis régénérer les pages.

## Référencement Google

Dans [Google Search Console](https://search.google.com/search-console), ajouter `https://sigep-tn.github.io/`, valider
avec la balise HTML proposée, puis envoyer `sitemap.xml`.
