import { Router } from "express";
import { DI } from "..";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PropertyFilter } from "@google-cloud/datastore";

enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

const router = Router();
const SALT_ROUNDS = 15;
const JWT_SECRET = process.env.JWT_SECRET || "devKey";

router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    return res
      .status(400)
      .json({ message: "name/email/password is undefined" });
  }

  // check if user already exists
  try {
    const query = DI.db
      .createQuery("user")
      .filter(new PropertyFilter("name", "=", name));
    const [user] = await DI.db.runQuery(query);

    if (user.length > 0) {
      return res.status(400).json({ message: "user already exists" });
    }
  } catch (e: any) {}

  try {
    const key = DI.db.key("user");

    const user = {
      key: key,
      uuid: randomUUID(),
      name: name,
      email: email,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      role: UserRole.STUDENT,
    };

    await DI.db.save({
      key: key,
      data: [
        {
          name: "uuid",
          value: user.uuid,
        },
        {
          name: "name",
          value: name,
        },
        {
          name: "email",
          value: email,
        },
        {
          name: "password",
          value: user.password,
        },
        {
          name: "role",
          value: user.role,
        },
      ],
    });

    // insert into bigtable

    res.status(200).json({ message: "success" });

    // cache the user to redis
    await DI.redis.set(`#user${name}`, JSON.stringify(user), {
      EX: 86400 * 7,
    });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ message: e.message });
  }
});

router.post("/normal", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "name or password is undefined" });
  }
  try {
    let user: any;

    // check if user is cached
    const cachedUser = await DI.redis.get(`user#${name}`);

    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      const query = DI.db
        .createQuery("user")
        .filter(new PropertyFilter("name", "=", name));
      const [dbuser] = await DI.db.runQuery(query);
      if (dbuser.length == 0) {
        return res.status(400).json({ message: "user does not exist" });
      }

      user = dbuser[0];

      // save user to cache
      await DI.redis.set(`user#${name}`, JSON.stringify(user), {
        EX: 86400 * 7,
      });
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "incorrect password" });
    }
    const authToken = sign(
      {
        uuid: user.key,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieExpiry = new Date(new Date().getTime() + 86400 * 1000 * 7);
    // return res.status(200).json({ authToken });
    return res
      .status(200)
      .cookie("token", authToken, {
        expires: cookieExpiry,
        httpOnly: true,
      })
      .send({ message: "success" });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ message: "user does not exist" });
  }
});

router.post("/silent", async (req, res) => {
  const authToken = req.cookies.token;

  if (!authToken) {
    return res.status(401).json({ message: "silent auth failed" });
  }

  try {
    const user = verify(authToken, JWT_SECRET);
    const cookieExpiry = new Date(new Date().getTime() + 86400 * 1000 * 7);
    // return res.status(200).json({ authToken });
    return res
      .status(200)
      .cookie("token", authToken, {
        expires: cookieExpiry,
        httpOnly: true,
      })
      .send({ message: "silent auth success" });
  } catch (e: any) {
    res.status(401).json({ message: "silent auth failed" });
  }
});

export const RootController = router;
