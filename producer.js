const JobService = require('./JobService');
const JobHandler = require('./consumer');
const { JobQueueName, JobQueue } = require('./jobQueueClient');
const JOBS = require('./jobs');

module.exports = class JobProducer {
    static async start() {
        return Promise.all(JOBS.map(async job => { // 队列添加job
            console.log(`=============== 注册job${job.name} ==================`)
            return JobService.register(job.name, job.payload, job.cron, job.options);
        })).then(() => {
            return JobService.clearUselessJobs(); //清除已经无效的job 
        }).catch(e => {
            console.error('job启动失败, error:' + JSON.stringify(e.stack));
        });
    }
}



