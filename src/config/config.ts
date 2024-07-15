export default () => ({
    database: {
        connectionString: process.env.MONGODB_CONNECTION_URL
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    }
})