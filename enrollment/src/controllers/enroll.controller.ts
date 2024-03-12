import { PropertyFilter } from "@google-cloud/datastore";
import { Router } from "express";
import { DI } from "..";

const router = Router();

router.post("/", async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) {
    return res.status(400).json({ message: "missing course uuid" });
  }

  const query_c = DI.db
    .createQuery("capacity")
    .filter(new PropertyFilter("course_uuid", "=", uuid));
  const [capacity] = await DI.db.runQuery(query_c);

  if (capacity.length == 0) {
    return res.status(400).json({ message: "invalid course uuid" });
  } else if (capacity[0].current >= capacity[0].value) {
    return res.status(400).json({ message: "course full" });
  }

  const capacity_key = capacity[0][DI.db.KEY];
  await DI.db.update({
    key: capacity_key,
    data: {
      uuid: capacity[0].uuid,
      capacity: capacity[0].value,
      current: capacity[0].current + 1,
      owner: capacity[0].owner,
    },
  });

  const query_u = DI.db
    .createQuery("enrollment")
    .filter(new PropertyFilter("course_uuid", "=", uuid))
    .filter(new PropertyFilter("user_uuid", "=", req.user.uuid));
  const [user_enrollment] = await DI.db.runQuery(query_u);

  if (user_enrollment.length > 0) {
    return res.status(403).json({ message: "same user cannot enroll twice" });
  }

  try {
    const key = DI.db.key("enrollment");
    await DI.db.save({
      key: key,
      data: [
        {
          name: "user_uuid",
          value: req.user.uuid,
        },
        {
          name: "course_uuid",
          value: uuid,
        },
      ],
    });

    return res.status(200).json({ uuid, message: "success" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

router.get("/enrolled", async (req, res) => {
  const query = DI.db
    .createQuery("enrollment")
    .filter(new PropertyFilter("user_uuid", "=", req.user.uuid));
  const [enrollments] = await DI.db.runQuery(query);
  return res.status(200).json(enrollments.map((e) => e.course_uuid));
});

export const EnrollController = router;
