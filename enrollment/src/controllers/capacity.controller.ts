import { Router } from "express";
import { DI } from "..";

const router = Router();

router.get("/all", async (req, res) => {
  const query = DI.db.createQuery("capacity");
  const [capacities] = await DI.db.runQuery(query);
  return res.status(200).json(capacities);
});

router.post("/create", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const { uuid, capacity } = req.body;
  if (!uuid || !capacity) {
    return res.status(400).json({ message: "course uuid/capacity missing" });
  }

  try {
    const key = DI.db.key("capacity");
    await DI.db.save({
      key: key,
      data: [
        {
          name: "uuid",
          value: uuid,
        },
        {
          name: "value",
          value: Number(capacity),
        },
        {
          name: "current",
          value: 0,
        },
        {
          name: "owner",
          value: req.user.uuid,
        },
      ],
    });

    return res.status(200).json({ message: "success" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const CapacityController = router;
