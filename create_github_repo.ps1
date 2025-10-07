# GitHub Repository Creation Script
# This script creates a GitHub repository using the GitHub API

Write-Host "GitHub Repository Creation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Get GitHub token
Write-Host "To create a GitHub repository, you need a Personal Access Token." -ForegroundColor Yellow
Write-Host ""
Write-Host "Follow these steps:" -ForegroundColor White
Write-Host "1. Go to: https://github.com/settings/tokens/new" -ForegroundColor White
Write-Host "2. Name: 'Freezer Cocktail Calculator Deploy'" -ForegroundColor White
Write-Host "3. Expiration: 7 days (just for this deployment)" -ForegroundColor White
Write-Host "4. Select scope: 'repo' (full control of private repositories)" -ForegroundColor White
Write-Host "5. Click 'Generate token' at the bottom" -ForegroundColor White
Write-Host "6. Copy the token (starts with 'ghp_')" -ForegroundColor White
Write-Host ""

$token = Read-Host "Paste your GitHub Personal Access Token here" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
$username = Read-Host "Enter your GitHub username"

Write-Host ""
Write-Host "Creating repository 'freezer-cocktail-batch-calculator'..." -ForegroundColor Yellow

# Create repository using GitHub API
$repoData = @{
    name = "freezer-cocktail-batch-calculator"
    description = "A calculator for batched freezer cocktails with volume, weight, and ABV calculations"
    homepage = ""
    private = $false
    has_issues = $true
    has_projects = $false
    has_wiki = $false
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $plainToken"
    Accept = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $repoData -ContentType "application/json"
    
    Write-Host ""
    Write-Host "✅ Repository created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host "Clone URL: $($response.clone_url)" -ForegroundColor Cyan
    Write-Host ""
    
    # Add remote and push
    Write-Host "Setting up git remote and pushing code..." -ForegroundColor Yellow
    git remote add origin $response.clone_url
    git branch -M main
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Deploy to Netlify" -ForegroundColor Cyan
    Write-Host "Visit: https://app.netlify.com/start" -ForegroundColor White
    Write-Host "Then: Import from Git → GitHub → Select your repo" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Error creating repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Token doesn't have 'repo' scope" -ForegroundColor White
    Write-Host "- Repository name already exists" -ForegroundColor White
    Write-Host "- Invalid token" -ForegroundColor White
}
