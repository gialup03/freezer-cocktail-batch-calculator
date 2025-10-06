#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start the Freezer Cocktail Batch Calculator development server
.DESCRIPTION
    This script checks for dependencies and starts the Vite development server.
    Compatible with both PowerShell Core (pwsh) and Windows PowerShell.
#>

# Stop on errors
$ErrorActionPreference = "Stop"

# Get the script directory (project root)
$ProjectRoot = $PSScriptRoot

# Change to project directory
Push-Location $ProjectRoot

try {
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Freezer Cocktail Batch Calculator - Startup  " -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""

    # Check if Node.js is installed
    Write-Host "[1/3] Checking Node.js installation..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version
        Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error: Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }

    # Check if npm is installed
    try {
        $npmVersion = npm --version
        Write-Host "  npm version: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error: npm is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }

    Write-Host ""

    # Check if node_modules exists, if not install dependencies
    Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow
    if (-not (Test-Path "node_modules")) {
        Write-Host "  node_modules not found. Installing dependencies..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  Error: Failed to install dependencies" -ForegroundColor Red
            exit 1
        }
        Write-Host "  Dependencies installed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "  Dependencies already installed" -ForegroundColor Green
    }

    Write-Host ""

    # Start the development server
    Write-Host "[3/3] Starting development server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Server will be available at http://localhost:5173" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""

    # Run the dev server
    npm run dev
}
finally {
    # Return to original directory
    Pop-Location
}
