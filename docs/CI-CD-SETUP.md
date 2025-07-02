# CI/CD Setup Guide

This project uses GitHub Actions for continuous integration and deployment. The workflow is located at `.github/workflows/ci-cd.yml`.

## Required GitHub Secrets

To enable full CI/CD functionality, configure the following secrets in your GitHub repository settings:

### Authentication & Testing

- `CLERK_PUBLISHABLE_KEY_TEST`: Clerk publishable key for testing environment
- `CLERK_SECRET_KEY_TEST`: Clerk secret key for testing environment

### Security Scanning

- `SNYK_TOKEN`: Snyk token for security vulnerability scanning

### Deployment

- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID
- `PRODUCTION_URL`: Production URL for smoke tests (e.g., `https://your-app.vercel.app`)

### Notifications

- `SLACK_WEBHOOK`: Slack webhook URL for deployment notifications

## Workflow Features

- **Type checking** with TypeScript
- **Linting** with ESLint
- **Security auditing** with npm audit and Snyk
- **Unit testing** with Jest (including coverage reports)
- **E2E testing** with Playwright
- **Docker image building** and publishing to GitHub Container Registry
- **Deployment** to Vercel
- **Smoke tests** against production
- **Slack notifications** for deployment status

## Package Manager

This project uses `pnpm` as the package manager. Make sure to:

1. Use `pnpm install` instead of `npm install`
2. Commit the `pnpm-lock.yaml` file
3. Use pnpm scripts in development

## Health Check Endpoint

A health check endpoint is available at `/api/health` for monitoring and smoke tests.
