module.exports = {
    port: 3000,
    db: {
        database: 'DeliveryApp',
        user: 'postgres',
        password: 'root',
        options: {
            dialect: 'postgres',
        }
    },
    authentication: {
        JWTSecret: 'yougotit'
    }
}