# 🤝 Contributing to ATScribe

Thank you for your interest in contributing to ATScribe! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork** locally
3. **Create a feature branch** from `develop`
4. **Make your changes** with tests
5. **Test thoroughly** and ensure quality checks pass
6. **Submit a pull request** to the `develop` branch

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/atscribe.git
cd atscribe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Development Workflow

### Branch Strategy
- `main` - Production branch (protected)
- `develop` - Development branch (default)
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical fixes for production

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add Google OAuth integration
fix(ui): resolve button alignment issue
docs(readme): update installation instructions
chore(deps): upgrade React to v19
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

## 🧪 Testing Requirements

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check
```

### Test Coverage
- Maintain **70%+ test coverage**
- Write tests for new features
- Update tests for modified functionality
- Include both positive and negative test cases

## 🎯 Code Quality Standards

### Code Style
- **TypeScript** strict mode enabled
- **ESLint** + **Prettier** for formatting
- **Consistent naming conventions**
- **Meaningful variable and function names**

### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/         # Next.js pages
├── lib/           # Utilities and services
├── hooks/         # Custom React hooks
├── types/         # TypeScript definitions
└── __tests__/     # Test files
```

### Component Guidelines
- Use **functional components** with hooks
- Implement **proper TypeScript types**
- Include **JSDoc comments** for complex logic
- Follow **single responsibility principle**

## 🔒 Security Guidelines

- **Never commit sensitive data** (API keys, passwords)
- **Validate all user inputs**
- **Use parameterized queries** for database operations
- **Implement proper error handling**
- **Follow OWASP security principles**

## 📖 Documentation

### Required Documentation
- **JSDoc comments** for functions and components
- **README updates** for new features
- **API documentation** for new endpoints
- **Migration guides** for breaking changes

### Documentation Style
- Clear and concise language
- Code examples where applicable
- Step-by-step instructions
- Screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots** if applicable

## 💡 Feature Requests

For new features, please provide:
- **Clear use case** and problem statement
- **Proposed solution** with examples
- **Alternative approaches** considered
- **Impact assessment** on existing functionality

## 🔄 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with develop

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Manual testing** if required
4. **Approval** from at least one maintainer

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - High priority
- `status:in-progress` - Currently being worked on

## 🎖️ Recognition

Contributors will be:
- **Listed in contributors** section
- **Mentioned in release notes** for significant contributions
- **Invited as collaborators** for consistent high-quality contributions

## 📞 Getting Help

- **GitHub Discussions** - For questions and ideas
- **GitHub Issues** - For bugs and feature requests
- **Email** - [koustav@example.com](mailto:koustav@example.com) for sensitive matters

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

Thank you for contributing to ATScribe! 🙏
