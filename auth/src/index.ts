import { Bigtable, Instance, Table } from "@google-cloud/bigtable";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { RootController } from "./controllers";
import { createClient, RedisClientType } from "redis";
// import cors from "cors";

export const DI = {} as {
  server: http.Server;
  bigtable: Bigtable;
  instance: Instance;
  table: Table;
  redis: RedisClientType;
};

export const app = express();
const port = process.env.PORT || 3071;

export const main = (async () => {
  if (process.env.NODE_ENV !== "production") {
    process.env.BIGTABLE_EMULATOR_HOST = "localhost:8086";
    DI.bigtable = new Bigtable({
      projectId: "test",
    });
    DI.instance = DI.bigtable.instance("localhost:8086");

    DI.redis = createClient();
  } else {
    DI.bigtable = new Bigtable();
    DI.instance = DI.bigtable.instance("auth-table");
    DI.redis = createClient({
      url: process.env.REDIS_URL,
    });
  }

  DI.table = DI.instance.table("user");
  await DI.redis.connect();

  const app = express();
  // app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use("/", RootController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  DI.server = http.createServer(app);
  DI.server.listen(port, () => {
    console.log(`auth microservice listening on ${port}`);
  });
})();
