# Manual GitHub Setup (5 minutes)

Simpler approach - create the repository directly on GitHub's website.

## Step 1: Create Repository on GitHub

1. Go to: **https://github.com/new**

2. Fill in the form:
   - **Repository name:** `freezer-cocktail-batch-calculator`
   - **Description:** `A calculator for batched freezer cocktails with volume, weight, and ABV calculations`
   - **Public** (select this - required for free hosting)
   - **DO NOT** check "Add a README file"
   - **DO NOT** check "Add .gitignore"
   - **DO NOT** check "Choose a license"

3. Click **"Create repository"**

## Step 2: Push Your Code

GitHub will show you a page with instructions. Under "…or push an existing repository from the command line", you'll see commands like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/freezer-cocktail-batch-calculator.git
git branch -M main
git push -u origin main
```

**Copy those commands** and run them in PowerShell:

1. Open PowerShell in your project folder:
   ```
   cd "C:\Users\Gianmarco Luppi\Workspace\freezer_cocktail_batch_calculator"
   ```

2. Paste the commands GitHub gave you (they'll have your username)

3. GitHub will prompt you to login if needed

## Step 3: Deploy to Netlify

Once your code is on GitHub:

1. Go to: **https://app.netlify.com/start**
2. Click: **"Import from Git"**
3. Click: **"GitHub"**
4. Authorize Netlify (if needed)
5. Select: **"freezer-cocktail-batch-calculator"**
6. Click: **"Deploy site"** (settings are auto-detected)

Your site will be live in ~2 minutes!

## Troubleshooting

**Git asks for authentication?**
- GitHub may open a browser window for authentication
- Or it will prompt you for username/password in PowerShell
- Use your GitHub username and a Personal Access Token as password

**Need a token?**
- Go to: https://github.com/settings/tokens/new
- Select scope: `repo`
- Copy the token and use it as your password

**Already have a remote?**
- Run: `git remote remove origin`
- Then try the `git remote add origin` command again
