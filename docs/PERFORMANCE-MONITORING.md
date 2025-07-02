# Performance Monitoring

This document outlines the performance monitoring setup for the ATScribe platform.

## Overview

The performance monitoring workflow runs automatically to ensure optimal application performance and user experience.

## Monitoring Components

### 🏠 Lighthouse Performance Audit

- **Trigger**: After successful deployments
- **Purpose**: Measures Core Web Vitals, accessibility, SEO, and best practices
- **Testing Environment**: Production site (https://atscribe.vercel.app)
- **URLs Tested**:
  - Homepage: `https://atscribe.vercel.app`
  - Dashboard: `https://atscribe.vercel.app/dashboard`
  - Resume Builder: `https://atscribe.vercel.app/resume/create`
- **Runs**: 3 runs per URL for reliable metrics
- **Performance Budgets**:
  - First Contentful Paint: ≤ 2000ms
  - Largest Contentful Paint: ≤ 2500ms
  - Cumulative Layout Shift: ≤ 0.1
  - Total Blocking Time: ≤ 300ms

### 📦 Bundle Size Analysis
- **Trigger**: Daily at midnight or manual dispatch
- **Purpose**: Tracks JavaScript bundle sizes and identifies optimization opportunities
- **Outputs**: Bundle statistics and chunk analysis

### 🚀 Web Vitals Monitoring
- **Trigger**: Daily schedule or manual dispatch
- **Purpose**: Continuous monitoring of real user experience metrics
- **Metrics**: LCP, FID, CLS, and other performance indicators

## Configuration Files

### lighthouserc.json
Contains Lighthouse CI configuration including:
- Performance thresholds (90% minimum score)
- Accessibility requirements (90% minimum score)
- SEO and best practices standards
- Desktop preset settings

## Performance Thresholds

| Metric | Threshold | Action |
|--------|-----------|---------|
| Performance Score | 90% | Warning if below |
| Accessibility Score | 90% | Error if below |
| Best Practices Score | 90% | Warning if below |
| SEO Score | 90% | Warning if below |

## Viewing Results

### Lighthouse Reports
- Reports are uploaded to temporary public storage
- Artifacts are available in GitHub Actions for 30 days
- Detailed performance metrics and recommendations included

### Bundle Analysis
- Bundle statistics uploaded as artifacts
- Size comparisons and chunk analysis available
- Recommendations for code splitting and optimization

## Maintenance

### Updating URLs
To add or modify URLs for testing, update the `urls` section in `.github/workflows/performance.yml` and the corresponding entries in `lighthouserc.json`.

### Adjusting Thresholds
Performance thresholds can be modified in `lighthouserc.json` under the `assertions` section.

### Schedule Changes
The monitoring schedule can be adjusted in the workflow file's `cron` expression. Currently set to run daily at midnight UTC.

## Troubleshooting

### Common Issues
1. **Lighthouse timeouts**: Check if the application is responding at the tested URLs
2. **Bundle analysis failures**: Ensure the build process completes successfully
3. **Missing artifacts**: Verify the paths in the upload configuration

### Manual Runs
Performance monitoring can be triggered manually using the "Run workflow" button in the GitHub Actions tab.
