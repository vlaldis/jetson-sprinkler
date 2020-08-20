const { spawn } = require('child_process');
const processDefinition = require("./configuration/processDefinition.json");


class Process {
    constructor({valves, duration, rounds, round_delay, valves_configuration})
    {
        this.valves = valves;
        this.rounds = rounds;
        this.round_delay = round_delay; 
        this.duration = duration;
        this.exited = false;

        if(valves_configuration !== undefined)
            this.valves_configuration = valves_configuration;
    }

    start()
    {
        const pythonArgs = [
            processDefinition.firmware,
            processDefinition.valves_configuration, this.valves_configuration,
            processDefinition.valves, ...this.valves,
            processDefinition.rounds, this.rounds,
            processDefinition.duration, this.duration,
            processDefinition.round_delay, this.round_delay
        ];

        this.process = spawn(processDefinition.python, pythonArgs);
        
        var output;
        this.process.stdout.on('data', (data) => {
            console.log('Pipe data from python script ...');
            output = data.toString();
        });

        this.process.on('close', (code) => {
            this.exited = true;
            console.log(`child process close all stdio with code ${code}`);
            console.log(output)
            return output;
        });
    }

    stop()
    {
        if(this.exited == true)
            return;

        this.process.kill();
    }
}

module.exports = 
{
    Process
}
