module.exports = {
    apps: [{
      name: 'ota-sherpa-momo-server',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }]
  };
  