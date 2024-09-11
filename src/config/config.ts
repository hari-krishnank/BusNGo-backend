export default () => ({
    database: {
        connectionString: process.env.MONGODB_CONNECTION_URL
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        adminSecret: process.env.JWT_ADMIN_SECRET,
        ownerSecret: process.env.JWT_OWNER_SECRET
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION
    }

})