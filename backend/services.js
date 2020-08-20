const { Process } = require('./process.js');

const valveConfig = "/home/supercomp/projects/jetson-sprinkler/firmware/src/valves.json";
let sprinklerProcess;

const runDemo = () => {
  const processParameters = {
    valves: [1],
    duration: 10,
    rounds: 1,
    round_delay: 5,
    valves_configuration: valveConfig
  }

  sprinklerProcess = new Process(processParameters);
  sprinklerProcess.start();
}

const stopDemo = () => {
  sprinklerProcess.stop();
}


module.exports =
{
  runDemo,
  stopDemo
}