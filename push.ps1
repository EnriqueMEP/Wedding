# Script para automatizar el Push a Git
# Uso: .\push.ps1 "Tu mensaje de commit"

$CommitMessage = $args[0]
if (-not $CommitMessage) {
    $CommitMessage = "Actualización Web de Boda - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "--- Iniciando Push ---" -ForegroundColor Cyan

Write-Host "1. git add ."
git add .

Write-Host "2. git commit -m '$CommitMessage'"
git commit -m $CommitMessage

Write-Host "3. git push"
git push

Write-Host "--- Proceso completado ---" -ForegroundColor Green
