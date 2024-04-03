# Define.ps1

# Charger les variables d'environnement depuis .env
Get-Content .env | ForEach-Object {
    $key, $value = $_ -split '=', 2
    Set-Item -Path env:$key -Value $value
}

# Vérifier et mettre à jour JWT_SECRET dans .env si nécessaire
$envContent = Get-Content .env -Raw
if(-not ($envContent -match 'JWT_SECRET')) {
    $jwtSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes(32))
    $envContent += "`nJWT_SECRET=$jwtSecret"
    $envContent | Set-Content .env
    Write-Host "JWT_SECRET added to .env"
} else {
    Write-Host "JWT_SECRET exists in .env"
}

# Tuer tous les processus Node.js en cours d'exécution
Get-Process node -ErrorAction SilentlyContinue | Stop-Process

# Démarrer les services
Write-Host "Starting MongoDB with Docker Compose..."
docker-compose up -d

Write-Host "Starting services..."
Write-Host "Starting - Middleware"
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm install && npm start"

Write-Host "Starting - Auth Service"
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd services/auth && npm install && npm start"

Write-Host "All services have been started."

# Pour le développement en utilisant nodemon, vous pouvez ajouter une fonction similaire:
Function Start-DevServices {
    npm install -g nodemon

    Write-Host "Starting MongoDB with Docker Compose..."
    docker-compose up -d

    Write-Host "Starting services with nodemon for development..."
    Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd services/middleware && npm install && nodemon middleware.js"

    Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd services/auth && npm install && nodemon authService.js"

    Write-Host "All services have been started in development mode."
}
