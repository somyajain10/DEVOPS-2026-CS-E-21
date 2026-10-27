if (process.env.RUNNING_IN_DOCKER === "1" && process.env.MONGO_URI) {
  const mongoUri = new URL(process.env.MONGO_URI);
  if (["localhost", "127.0.0.1", "::1"].includes(mongoUri.hostname)) {
    mongoUri.hostname = "host.docker.internal";
    process.env.MONGO_URI = mongoUri.toString();
  }
}

require("./server");
