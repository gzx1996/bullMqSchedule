const { Queue, QueueScheduler  } = require('bullmq');
const { redis } = require('./redisClient');
const JobQueueName = 'jobQueue'

const JobQueue = new Queue(JobQueueName, {
    connection: redis,
    defaultJobOptions: {
        priority: 1, //优先级, 数字越小优先级越高
        removeOnComplete: true, // 对于单次任务成功之后直接移除
        removeOnFail: 100, // 失败若干次后直接删除
        attempts: 100, // 每个任务重试次数
        backoff: {
          type: "exponential",
          delay: 1000
        }
    }
});


const JobQueueScheduler = new QueueScheduler(JobQueueName, {
    connection: redis
});

module.exports = {
    JobQueue,
    JobQueueScheduler,
    JobQueueName
};