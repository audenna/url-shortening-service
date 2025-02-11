import cluster from "node:cluster";
import { cpus } from "node:os";
import { Worker } from "node:cluster";

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Restart workers on exit
    cluster.on("exit", (worker: Worker) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
    });

} else require('./server');
