const log4js = require('log4js');
const config = require('config')
log4js.configure(config.log4js);

const JobConsumer = require("./consumer");
const JobProducer = require("./producer");

JobProducer.start().then(() => {
    JobConsumer.start();
})