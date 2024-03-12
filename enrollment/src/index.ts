import express from "express";
import http from "http";
import { Datastore } from "@google-cloud/datastore";
import { CapacityController, EnrollController } from "./controllers";
import authMiddleware from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
// import cors from "cors";

export const DI = {} as {
  server: http.Server;
  db: Datastore;
};

export const app = express();
const port = process.env.PORT || 3001;

export const main = (async () => {
  if (process.env.NODE_ENV === "production") {
    DI.db = new Datastore({ databaseId: process.env.DB_NAME });
  } else {
    DI.db = new Datastore({});
  }

  const app = express();
  // app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(authMiddleware);
  app.use("/capacity", CapacityController);
  app.use("/enroll", EnrollController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  DI.server = http.createServer(app);
  DI.server.listen(port, () => {
    console.log(`enrollment microservice listening on ${port}`);
  });
})();
