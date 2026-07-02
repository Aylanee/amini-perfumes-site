============================================
   AMINI PERFUMES - DEPLOIEMENT VERCEL
============================================

METHODE 1 (AUTOMATIQUE):
  Double-clique sur deploy.bat
  Tu n'auras qu'a coller ton token Vercel et appuyer Entree.

METHODE 2 (MANUELLE - si le bat ne marche pas):

Etape 1 - Installer Node.js
  - Va sur https://nodejs.org
  - Telecharge la version "LTS" (bouton vert)
  - Installation: Suivant > Suivant > Terminer

Etape 2 - Genere un token Vercel
  - Va sur https://vercel.com/account/tokens
  - Bouton "Create Token"
  - Nom: amini
  - Scope: Full Account
  - Expiration: 1 day
  - Clique Create, COPIE le token immediatement

Etape 3 - Ouvre l'invite de commandes (CMD)
  - Touche Windows + R
  - Tape: cmd
  - Entree

Etape 4 - Va dans le dossier amini-vercel
  - Tape (remplace par ton vrai chemin):
    cd C:\Users\TON_NOM\Desktop\amini-vercel
  - Entree

Etape 5 - Installe Vercel CLI (une fois seulement)
  npm install -g vercel

Etape 6 - Deploie le site
  Remplace TON_TOKEN par celui que tu as copie a l'etape 2:

  vercel deploy --prod --yes --token=TON_TOKEN

  Vercel va te donner une URL. NOTE-LA.

Etape 7 - Ajoute la cle Mistral AI
  echo Q8hJhltl9svgeOI0qqW9zdoAuyNKwU0M | vercel env add MISTRAL_API_KEY production --token=TON_TOKEN

Etape 8 - Redeploie pour activer la cle
  vercel deploy --prod --yes --token=TON_TOKEN

  C'est cette URL finale que tu utilises.

Etape 9 - REVOQUE LE TOKEN (securite)
  Va sur https://vercel.com/account/tokens
  Trouve "amini" -> clique sur les ... -> Delete

============================================

EN CAS DE PROBLEME:
  - Verifie que Node.js est bien installe: tape "node -v" dans CMD
  - Verifie que tu es dans le bon dossier: tape "dir" et tu dois voir index.html
  - Si erreur "vercel not found": ferme et reouvre CMD apres installation Vercel CLI

============================================
