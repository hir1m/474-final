import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/postgresql";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { User } from "./entities/user.entity";
import { RootController } from "./controllers";
// import cors from "cors";

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  user: EntityRepository<User>;
};

export const app = express();
const port = process.env.PORT || 3000;

export const main = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.user = DI.orm.em.getRepository(User);

  const app = express();
  // app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use("/", RootController);
  app.use((req, res) => res.status(404).json({ message: "No route found" }));

  DI.server = http.createServer(app);
  DI.server.listen(port, () => {
    console.log(`auth microservice listening on ${port}`);
  });
})();
