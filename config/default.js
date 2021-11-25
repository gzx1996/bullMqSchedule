module.exports = {
    redis: {
        host: 'your redis host',
        port: 'your redis port',
        password: "your redis password",
        db: 0, // 可自定义
        maxRetriesPerRequest: null,
        enableReadyCheck: false
    },
    log4js: {
        appenders: {
            default: {
                type: 'dateFile',
                filename: './logs/default.log',
                maxLogSize: 21474836480,
                backups: 5,
                compress: true,
                daysToKeep: 30
            },
            job: {
                type: 'dateFile',
                filename: './logs/job.log/',
                maxLogSize: 21474836480,
                backups: 5,
                compress: true,
                daysToKeep: 30
            }
        },
        categories: {
            default: { appenders: ['default'], level: 'info' },
            job: { appenders: ['job'], level: 'info' },
        },
        pm2: true,
        pm2InstanceVar: 'NODE_APP_INSTANCE'
    }
}