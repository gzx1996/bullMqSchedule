const { JobQueue } = require('./jobQueueClient');
const check = require('check-types');

const CRON_LAMBDA_REGEX = /(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}/

const JobMap = {};

module.exports =  class JobService {
    /**
     * 注册job
     * @param {string} name 任务名称
     * @param {object} payload 数据集
     * @param {string} cron cron表达式
     * @param {object} options 选项
     * @param {number} options.priority 优先级, 数字越小, 优先级越高
     * @param {number} options.attempts 失败重试次数, 默认不重试
     * @param {object} options.backoff 失败重试策略 
     * eg: {
     *      type: "exponential",
     *      delay: 1000
     *  } 在失败后以一秒为基数,指数级重试, 即 1, 2, 4, 8, 16....
     * @param {number} options.removeOnFail 失败之后删除job
     */
     static async register(name, payload, cron, options = {}) {
        const CRON_LAMBDA_REGEX = /(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}/
        if (!check.nonEmptyString(name)) throw new Error('add job failed, missing parameter: name');
        if (!check.nonEmptyString(cron)) throw new Error('add job failed, missing parameter: cron');
        if (!CRON_LAMBDA_REGEX.test(cron)) throw new Error('add job failed, invalid parameter: cron');
        
        let allJobs = await JobQueue.getRepeatableJobs(0 ,1000);
        let job = allJobs.find(x => x.id === name);
        if (!job || (job && job.cron !== cron)) {
            if (job && job.cron !== cron) {
                await JobQueue.removeRepeatableByKey(job.key);
            }
            job = await JobQueue.add(name, payload || {}, Object.assign({
                jobId: name,
                repeat: { cron }
            }, options));
        }
        JobMap[name] = job;
        return job;
    };
    /**
     * 获取所有任务
     */
     static async getJobs() {
        let allJobs = await JobQueue.getRepeatableJobs(0 ,1000);
        return allJobs.map(job => {
            let mapCache = JobMap[job.id];
            if (mapCache) {
                Object.assign(job, mapCache);
            }
            return job;
        })
    }
    /**
     * 移除任务
     * @param {string} name 
     */
    static async removeJobByName(name) {
        if (!name) throw new Error('remove job failed, missing parameter: name');
        let allJobs = await JobQueue.getRepeatableJobs(0 ,1000);
        let targets = allJobs.filter(x => x.id === name);
        targets.map(async t => { // 删除队列
            await JobQueue.removeRepeatableByKey(t.key);
        })
        delete JobMap[name]; // 删除缓存
    }
    /**
     * 清除掉没有注册过的job
     * @returns 
     */
    static async clearUselessJobs() {
        let allJobs = await JobQueue.getRepeatableJobs(0 ,1000);
        let targets = allJobs.filter(x => !JobMap[x.id]);
        return targets.map(async t => { // 删除队列
            await JobQueue.removeRepeatableByKey(t.key);
        });
    }
}