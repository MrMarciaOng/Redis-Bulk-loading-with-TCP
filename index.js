var redis = require('redis-stream')

let count = 0;

//assuming there are 5millions rows to add do in parallel
Promise.all([insertKeys(0, 1000000),
insertKeys(1000000, 2000000),
insertKeys(2000000, 3000000),
insertKeys(3000000, 4000000),
insertKeys(4000000, 5000000)]).then(() => {
    console.log("done")
    console.log(count)
})


function insertKeys(start, end) {
    return new Promise((resolve, reject) => {
        var client = new redis(6379, '127.0.0.1');
        var stream = client.stream();

        for (var record = start; record < end; record++) {

            // Command is an array of arguments:
            const command = ['set', 'key' + record, `value${record}`];

            // Send command to stream, but parse it before
            stream.redis.write(redis.parse(command));
            count++
        }

        stream.on('close', function () {
            console.log('Write batch Completed!');
            resolve("ok")


        });
        stream.end();
    })
}



