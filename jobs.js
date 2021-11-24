const JOBS = [
    {
        name: 'test',
        payload: {
            test: 'test'
        },
        cron: '0 */3 * * * *',
        fn: test,
        params: [14, 6],
        options: {}
    },
    {
        name: 'test2',
        payload: {
            test: 'test2'
        },
        cron: '0 */5 * * * *',
        fn: (a, b) => {
            console.log('this is another test job', a * b)
        },
        params: [14, 6],
        options: {}
    }
]

async function test(a, b) {
    console.log('this is a test job', a + b)
}

module.exports = JOBS;