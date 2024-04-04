import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { RootController } from "./controllers";
import { createClient, RedisClientType } from "redis";
import { Datastore } from "@google-cloud/datastore";
import { configDotenv } from "dotenv";
// import cors from "cors";

export const DI = {} as {
  server: http.Server;
  db: Datastore;
  redis: RedisClientType;
};

export const app = express();
const port = process.env.PORT || 3071;

export const main = (async () => {
  if (process.env.NODE_ENV !== "production") {
    configDotenv({ path: `${__dirname}/../.env.local` });

    process.env.BIGTABLE_EMULATOR_HOST = "localhost:8086";
    DI.db = new Datastore();
    DI.redis = createClient();
  } else {
    DI.db = new Datastore({ databaseId: process.env.DB_NAME });
    DI.redis = createClient({
      url: process.env.REDIS_URL,
    });
  }

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
