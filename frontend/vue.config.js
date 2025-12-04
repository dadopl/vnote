const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7776',
                changeOrigin: true
            },
            '/recordings': {
                target: 'http://localhost:7776',
                changeOrigin: true
            }
        }
    }
})
