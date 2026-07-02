@echo off
title AMINI PERFUMES - Deploy

echo.
echo ============================================
echo    AMINI PERFUMES - Deploiement Vercel
echo ============================================
echo.

REM Verifier que Node.js est installe
where node >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Node.js n^'est pas installe.
  echo Telecharge-le sur https://nodejs.org et relance.
  pause
  exit /b 1
)

echo [OK] Node.js detecte:
call node -v
echo.

REM Demander le token Vercel
echo Va sur https://vercel.com/account/tokens pour generer un token.
echo Nom: amini  -  Scope: Full Account  -  Expiration: 1 day
echo.
set /p TOKEN="Colle ton token ici (commence par vcp_): "
echo.

if "%TOKEN%"=="" (
  echo [ERREUR] Token vide. Abandon.
  pause
  exit /b 1
)

REM Installer Vercel CLI si pas la
where vercel >nul 2>&1
if errorlevel 1 (
  echo [INFO] Installation de Vercel CLI...
  call npm install -g vercel
)

echo.
echo [INFO] Deploiement en cours, attendez 60 secondes...
echo.

call vercel deploy --prod --yes --token=%TOKEN%

echo.
echo [INFO] Configuration de la cle Mistral AI...
(echo Q8hJhltl9svgeOI0qqW9zdoAuyNKwU0M) | call vercel env add MISTRAL_API_KEY production --token=%TOKEN% --force

echo.
echo [INFO] Redeploiement final avec cle Mistral active...
call vercel deploy --prod --yes --token=%TOKEN%

echo.
echo ============================================
echo    DEPLOIEMENT TERMINE
echo ============================================
echo.
echo Ton site est en ligne. Verifie l URL ci-dessus.
echo.
echo IMPORTANT: revoque ton token Vercel:
echo   https://vercel.com/account/tokens
echo.
pause
