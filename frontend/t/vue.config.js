module.exports = {
    devServer: {
      host: '0.0.0.0',
      port: 4000,
      proxy:{
        [process.env.VUE_APP_BASE_API]: {
          target: 'http://loaclhost:8080',
          changeOrigin: true
        }
      }
    }
  }