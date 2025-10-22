module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      url: [
        'http://localhost:3000',
        'http://localhost:3000/vendor/signup',
        'http://localhost:3000/market',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
