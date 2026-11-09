# SIGEP — site vitrine (sigep.github.io)

Site statique de **SIGEP – Société d'Installation des Générateurs Photovoltaïques** (Sbikha, Kairouan) :
installation photovoltaïque, pompage solaire et chauffe-eau solaires.

- **Français** : `https://sigep.github.io/`
- **Arabe (darja tunisienne)** : `https://sigep.github.io/ar/`

HTML5, CSS3 et JavaScript vanilla : aucun framework, aucune étape de construction. Le dossier se publie tel quel.

## Contenu du dossier

| Élément | Rôle |
|---|---|
| `index.html` | Accueil en français : héros, chiffres, services, méthode, réalisations filtrables, atouts, galerie photos/vidéos, avis, contact |
| `ar/index.html` | Même accueil en arabe tunisien, de droite à gauche |
| `realisations/*.html`, `ar/realisations/*.html` | Une page par réalisation (16 par langue) : photos, vidéo, description |
| `mentions-legales.html`, `404.html` | Pages annexes |
| `css/style.css` | Feuille de style unique (thème clair/sombre, mobile d'abord, arabe de droite à gauche) |
| `js/main.js` | Interactions : menu, thème, diaporama, filtres, galerie, visionneuse, fenêtre « devis gratuit » |
| `assets/images/photos/` | 121 photos en WebP, 3 tailles chacune (480, 960, 1600 px) |
| `assets/videos/` | 5 vidéos MP4 (H.264) et leur image d'aperçu |
| `assets/logo/` | Logo SVG (couleur, blanc, icône) et PNG haute définition |
| `assets/icons/`, `favicon.ico`, `manifest.webmanifest` | Icônes et installation sur mobile |
| `sitemap.xml`, `robots.txt` | Référencement (versions française et arabe liées par `hreflang`) |
| `.nojekyll` | Demande à GitHub Pages de publier les fichiers sans les transformer |

Le bouton **« Devis gratuit »** ouvre une fenêtre avec tous les moyens de contact : 2 numéros, WhatsApp (message déjà
rédigé), téléphone fixe, e-mail et Facebook. Le site ne contient aucun formulaire.

## Déployer sur GitHub Pages

L'adresse `https://sigep.github.io` impose un compte (ou une organisation) GitHub nommé **`sigep`** et un dépôt
nommé exactement **`sigep.github.io`**.

1. Créer le compte : <https://github.com/signup>, nom d'utilisateur **`sigep`** (s'il est déjà pris, voir plus bas).
2. Créer le dépôt : <https://github.com/new>, nom **`sigep.github.io`**, visibilité **Public**, sans README.
3. Envoyer le contenu de ce dossier (`site_web_sigep/site`) à la racine du dépôt :

   ```bash
   cd D:/SIGEP_V2/site_web_sigep/site
   git init -b main
   git add .
   git commit -m "Site SIGEP"
   git remote add origin https://github.com/sigep/sigep.github.io.git
   git push -u origin main
   ```

   Sans ligne de commande : sur la page du dépôt, **Add file › Upload files**, puis glisser le *contenu* du dossier
   `site` (et non le dossier lui-même) en plusieurs fois si besoin (100 fichiers maximum par envoi).
4. Dans le dépôt : **Settings › Pages › Build and deployment › Source : Deploy from a branch**, branche **`main`**,
   dossier **`/ (root)`**, **Save**.
5. Après 1 à 3 minutes, le site est en ligne sur <https://sigep.github.io>.

Chaque nouvel envoi (`git push`) met le site à jour automatiquement.

> Si le nom `sigep` n'est pas disponible sur GitHub, choisir un autre nom (par exemple `sigep-solaire`) : l'adresse
> devient `https://sigep-solaire.github.io`. Remplacer alors `https://sigep.github.io` dans
> `../outils/donnees.py` (variable `SITE`) et régénérer les pages (voir plus bas), pour que les balises SEO,
> le sitemap et les images de partage pointent vers la bonne adresse.

### Nom de domaine personnalisé (facultatif, recommandé)

Avec un domaine du type `sigep.tn` ou `sigep-solaire.com` :
1. Acheter le domaine chez un registraire (pour `.tn` : un prestataire agréé par l'ATI).
2. Chez le registraire, créer 4 enregistrements **A** vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153` et un **CNAME** `www` vers `sigep.github.io`.
3. Dans **Settings › Pages › Custom domain**, saisir le domaine, puis cocher **Enforce HTTPS**.
4. Remplacer `SITE` dans `../outils/donnees.py` par la nouvelle adresse et régénérer les pages.

## Être bien référencé sur Google

### Google Search Console (indexation du site)
1. Ouvrir <https://search.google.com/search-console> avec le compte Google de l'entreprise.
2. **Ajouter une propriété › Préfixe de l'URL** : `https://sigep.github.io/`.
3. Validation : choisir **Balise HTML**, copier la balise `<meta name="google-site-verification" ...>`, l'ajouter dans
   le `<head>` de `index.html` (ou, mieux, dans la fonction `page()` de `../outils/pages.py` puis régénérer), envoyer
   sur GitHub, puis cliquer sur **Valider**.
4. Menu **Sitemaps** : envoyer `sitemap.xml`.
5. Menu **Inspection de l'URL** : tester `https://sigep.github.io/` et `https://sigep.github.io/ar/`, puis
   **Demander l'indexation**.
6. Revenir après quelques jours : rapports **Pages** (indexation) et **Performances** (recherches qui amènent des visiteurs).

### Google Business Profile (fiche Google Maps)
La fiche « SIGEP (تركيب الطاقة الشمسية) » existe déjà sur Google Maps. Pour la contrôler :
1. Ouvrir la fiche sur Google Maps, cliquer sur **Revendiquer cet établissement** et suivre la validation
   (appel, SMS, e-mail ou vidéo).
2. Une fois validée sur <https://business.google.com> :
   - **Site web** : `https://sigep.github.io/` ;
   - **Catégorie principale** : « Fournisseur d'équipements d'énergie solaire » ou « Entreprise d'énergie solaire »
     (au lieu de « Entreprise de construction ») ; catégories secondaires : « Électricien », « Entrepreneur » ;
   - **Services** : installation photovoltaïque, pompage solaire, chauffe-eau solaire, étude gratuite ;
   - **Zone desservie** : Sbikha et les délégations voisines ;
   - **Description** : reprendre le texte du site ;
   - **Photos** : ajouter les meilleures photos de chantier (dossier `assets/images/photos`, version 1600 px) ;
   - **Téléphones** : 98 701 392, 50 709 544, 77 366 486.
3. Demander un **avis Google** à chaque client satisfait (le site contient déjà un bouton « Donner mon avis sur Google »).
4. Vérifier que l'adresse est la même partout : Google Maps (Rue 2 Mars 1934), liste ANME
   (Rue Salaheddine Ayoubi, Cité Mongi Slim) et Facebook (Immeuble Ghannem, avenue Habib Bourguiba) donnent
   trois adresses différentes. Une adresse unique et identique partout aide le référencement local.

### Facebook
Dans la page Facebook SIGEP : **Modifier les informations › Site web** : `https://sigep.github.io/`.

## Modifier le site

Les pages sont générées par les scripts de `../outils/` (hors du site publié) :

| Fichier | Contenu |
|---|---|
| `outils/donnees.py` | Coordonnées, horaires, classement des photos, réalisations (français) |
| `outils/textes.py` | Tous les textes en français et en arabe tunisien, réalisations en arabe |
| `outils/medias.py` | Conversion des photos (WebP) et des vidéos (MP4 + aperçu) depuis `images_videos/` |
| `outils/pages.py` | Génération des pages HTML, du sitemap, de `robots.txt` et du manifeste |
| `outils/icones.mjs`, `outils/favicon.py` | Icônes, logos PNG et images de partage Facebook/WhatsApp |

Après une modification, depuis `D:\SIGEP_V2\site_web_sigep` :

```bash
python outils/medias.py
python outils/pages.py
```

`icones.mjs` n'est à relancer que si le logo change (`node outils/icones.mjs` puis `python outils/favicon.py`).
Prérequis : Python avec Pillow, ffmpeg, et pour `icones.mjs` Node.js avec Playwright et Microsoft Edge.

Pour de petites corrections de texte, on peut aussi modifier directement les fichiers HTML ; ces modifications seront
écrasées à la prochaine génération si elles ne sont pas reportées dans `textes.py` / `donnees.py`.

## Tester en local

```bash
python -m http.server 8093 --directory D:/SIGEP_V2/site_web_sigep/site
```

Puis ouvrir <http://localhost:8093> (et <http://localhost:8093/ar/>).
