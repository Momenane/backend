module.exports = {
    development: {
        "username": "arashrahimi46",
        "password": "fazilatschool1",
        "database": "momenane",
        "host": "127.0.0.1",
        "port" : "3306",
        "dialect": "mysql"
    },
    test: {
        dialect: "sqlite",
        storage: ":memory:"
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        use_env_variable: 'DATABASE_URL'
    }
};