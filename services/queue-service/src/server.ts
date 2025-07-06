import { fanoutWorker } from "@libs/queue/fanout.worker";

if (!fanoutWorker.isRunning()) {
  fanoutWorker.run();
}
console.log("✅ Queue service is running and processing jobs");
