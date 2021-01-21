module.exports = {
  apps: [
    {
      name: 'server-hapi',
      script: 'dist/server.js',
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: '10.209.158.21',
      ref: 'origin/master',
      repo: 'https://gitlab.com/andresgnu-public/hapits.git',
      path: '/home/ubuntu/server',
      'post-deploy':
        'yarn install && yarn build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
