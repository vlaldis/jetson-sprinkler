var CronJob = require('cron').CronJob;
var mongo = require('mongodb');


const jobs = {};


var job = new CronJob('* * * * * *', function() {
    console.log('You will see this message every second');
  }, null, true, 'America/Los_Angeles');
job.start();

const addJob = (process) =>
{
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn(python, [firmware, '-h']);
    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      console.log(dataToSend)
      return dataToSend;
    });     
    var job = new CronJob('* * * * * *', function() {
        process.command;
      }, null, true, 'America/Los_Angeles');
    job.start(); 
} 

const init = () => {
    const schedules = mongo/ 
}


module.exports = {
    nieco,
    init
}
