---
# yaml-language-server: $schema=schemas/page.schema.json
Object type:
    - Page
Backlinks:
    - Arquitectura
Tag:
    - github
    - git
Creation date: "2025-10-19T18:24:58Z"
Created by:
    - peks
id: bafyreidooi2hmseirpljxrafsglexk4hlqy6cqpab3wwzekvh7cdn7sdo4
---
# Git Strategy - Basket Places Contributors   
## 🏀 Welcome Contributors!   
This document outlines the Git workflow for **Basket Places**, an open-source MVP for discovering and booking basketball courts. Following these guidelines ensures smooth collaboration and maintains code quality.   
 --- 
## 🚀 Project Overview   
**Tech Stack:**   
- Frontend: Next.js + TypeScript   
- Backend: Supabase   
- Database: PostgreSQL   
- Deployment: Vercel   
   
**Repository:** [Add your GitHub repo URL here]   
 --- 
## 🌿 Branch Strategy   
### Main Branches   
- `**main**` → Production-ready code (protected)   
- `**develop**` → Integration branch for features   
   
### Feature Branches   
- `**feature/[name]**` → New features   
- `**hotfix/[name]**` → Critical production fixes   
- `**release/[version]**` → Version preparation   
 --- 
   
## 📋 Contribution Workflow   
### 1. Getting Started   
```
# Fork and clone the repository
git clone https://github.com/[username]/basket-places.git
cd basket-places

# Add upstream remote
git remote add upstream https://github.com/[original]/basket-places.git

# Install dependencies
npm install

```
### 2. Creating a Feature   
```
# Always start from updated develop
git checkout develop
git pull upstream develop

# Create your feature branch
git checkout -b feature/court-ratings

```
### 3. Development Process   
```
# Make your changes and commit frequently
git add .
git commit -m "feat(ratings): add star rating component"

# Keep your branch updated
git fetch upstream
git rebase upstream/develop

```
### 4. Submit Your Contribution   
```
# Push to your fork
git push origin feature/court-ratings

# Create Pull Request from your fork to upstream/develop

```
 --- 
## ✅ Commit Conventions   
We use [Conventional Commits](https://www.conventionalcommits.org/) format:   
```
<type>(<scope>): <description>

[optional body]
[optional footer]

```
### Types:   
- `feat:` New feature   
- `fix:` Bug fix   
- `docs:` Documentation   
- `style:` Code style changes   
- `refactor:` Code restructuring   
- `test:` Adding/updating tests   
- `chore:` Maintenance tasks   
   
### Examples:   
```
git commit -m "feat(auth): implement OAuth login"
git commit -m "fix(map): resolve geolocation accuracy issue"
git commit -m "docs(api): add endpoint documentation"

```
 --- 
## 🎯 Current Priority Features   
### 🔥 High Priority   
- [ ] Court search and filtering   
- [ ] User authentication system   
- [ ] Basic booking functionality   
- [ ] Mobile responsive design   
### 📝 Medium Priority   
- [ ] User profiles and reviews   
- [ ] Payment integration   
- [ ] Court availability calendar   
- [ ] Push notifications   
### 💡 Future Features   
- [ ] Social features (friends, groups)   
- [ ] Court owner dashboard   
- [ ] Advanced analytics   
- [ ] Multi-language support   
 --- 
## 🛡️ Code Standards   
### Pull Request Requirements:   
- ✅ Follows commit conventions   
- ✅ Includes tests for new features   
- ✅ Updates documentation if needed   
- ✅ Passes all CI checks   
- ✅ Code review approved   
   
### Branch Naming:   
```
feature/user-authentication
fix/booking-validation-error
hotfix/security-patch
release/v1.2.0

```
 --- 
## 🧪 Testing & Quality   
```
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check

# Build check
npm run build

```
All PRs must pass these checks before merging.   
 --- 
## 🚨 Important Rules   
### ✅ DO:   
- Create focused, single-purpose branches   
- Write clear commit messages   
- Test your changes locally   
- Update documentation   
- Ask questions if unsure   
   
### ❌ DON'T:   
- Push directly to `main` or `develop`   
- Mix unrelated changes in one PR   
- Force push to shared branches   
- Ignore failing tests   
- Skip code review process   
 --- 
   
## 📞 Getting Help   
- **Issues:** Check existing issues or create a new one   
- **Discussions:** Use GitHub Discussions for questions   
- **Discord:** [Add Discord invite if you have one]   
- **Email:** [Add contact email]   
 --- 
   
## 🏆 Recognition   
Contributors will be:   
- Added to project README   
- Mentioned in release notes   
- Invited to maintainer team (active contributors)   
 --- 
   
**Thanks for contributing to Basket Places! Together we're building something awesome for the basketball community! 🏀   
