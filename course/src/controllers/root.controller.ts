import { Router } from "express";
import { DI } from "..";
import { randomUUID } from "crypto";
import { PropertyFilter } from "@google-cloud/datastore";

const router = Router();

router.get("/all", async (req, res) => {
  const query = DI.db.createQuery("courses");
  const [courses] = await DI.db.runQuery(query);
  return res.status(200).json(courses);
});

router.post("/create", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const { code, description } = req.body;
  const uuid = randomUUID();

  try {
    const key = DI.db.key("course");
    await DI.db.save({
      key: key,
      data: [
        {
          name: "uuid",
          value: uuid,
        },
        {
          name: "code",
          value: code,
        },
        {
          name: "description",
          value: description,
        },
        {
          name: "owner",
          value: req.user.uuid,
        },
      ],
    });

    return res.status(200).json({ uuid, message: "success" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

router.post("/delete", async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) {
    return res.status(400).json({ message: "uuid is required" });
  }

  try {
    const query = DI.db
      .createQuery("course")
      .filter(new PropertyFilter("uuid", "=", uuid));
    const [courses] = await DI.db.runQuery(query);

    if (courses.length === 0) {
      return res.status(400).json({ message: "no course with uuid" });
    }

    const key = courses[0][DI.db.KEY];
    await DI.db.delete(key);

    return res.status(200).json({ message: "success" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const RootController = router;
