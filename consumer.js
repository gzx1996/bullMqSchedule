const { Worker } = require('bullmq');
const { redis } = require('./redisClient');
const { JobQueueName } = require('./jobQueueClient');
const logger = require('log4js').getLogger('job')
const moment = require('moment');

const JOBS = require('./jobs');

const consumeFn = async (job) => {
    let t = JOBS.find(x => x.name === job.name)
    if (t) {
        logger.info(`========job: ${t.name}开始执行, 执行时间 ${moment().format('YYYY-MM-DD hh:mm:ss')}=======`)
        await t.fn(...(t.params || {}));
    }
}

module.exports = class JobConsumer {
    static async start() {
        new Worker(JobQueueName, consumeFn, {
            connection: redis
        });
    }
}