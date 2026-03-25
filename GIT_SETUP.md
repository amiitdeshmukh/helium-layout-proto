# Git + SSH Setup Guide (Windows with spaces in username)

## One-Time Setup

### 1. Copy your SSH key to a path without spaces
```powershell
New-Item -ItemType Directory -Force -Path "C:\sshkeys"
Copy-Item "$env:USERPROFILE\.ssh\id_ed25519" "C:\sshkeys\id_personal"
```

### 2. Test the connection
```powershell
ssh -T -i C:\sshkeys\id_personal git@github.com
```
You should see: `Hi <yourname>! You've successfully authenticated...`

---

## For Every New Repo

### Step 1 — Create an empty repo on GitHub
- Go to github.com → New repository
- **Do NOT** check "Add a README" — keep it completely empty

### Step 2 — Initialize locally
```powershell
cd path/to/your/project
git init
```

### Step 3 — Set SSH key for this repo
```powershell
git config --local core.sshCommand "ssh -i C:/sshkeys/id_personal -o IdentitiesOnly=yes"
```

### Step 4 — Add remote
```powershell
git remote add origin git@github.com:<username>/<repo-name>.git
```

### Step 5 — Commit and push
```powershell
git add .
git commit -m "initial commit"
git push -u origin master
```

---

## For Future Pushes (same repo)
```powershell
git add .
git commit -m "your message"
git push
```

---

## Why `C:\sshkeys`?
Windows username `Amit Deshmukh` has a space in it. SSH cannot handle spaces
in key file paths, so copying the key to `C:\sshkeys` (no spaces) fixes this permanently.
