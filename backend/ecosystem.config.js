module.exports = {
    apps: [{
      name: 'sherpa-momo',
      script: './dist/server.js',
      // also to start the server on the production server, run the command: pm2 start ecosystem.config.js
      cwd: '/home/ubuntu/sherpamomo/backend',// this is the setup for the production server
      env: {
        NODE_ENV: 'production'
      }
    }]
  }