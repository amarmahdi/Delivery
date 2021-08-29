module.exports = {
    port: 3000,
    db: {
        database: 'trying',
        user: 'trying',
        password: '',
        options: {
            dialect: 'sqlite',
            host: 'localhost',
            storage: './trying.sqlite'
        }
    },
    authentication: {
        JWTSecret: 'secret'
    }
}