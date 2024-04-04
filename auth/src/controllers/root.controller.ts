import { Router } from "express";
import { DI } from "..";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";

enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
}

interface User {
  key: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
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
    const [user] = await DI.table.row(`user#${name}`).get();
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
  } catch (e: any) {}

  try {
    // const timestamp = new Date().getTime() * 1000;
    const newUser = {
      key: `user#${name}`,
      name,
      email,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      role: UserRole.STUDENT,
    } as User;

    // insert into bigtable

    const rowToInsert = {
      key: newUser.key,
      data: {
        name: {
          value: newUser.name,
        },
        email: {
          value: newUser.email,
        },
        password: {
          value: newUser.password,
        },
        role: {
          value: newUser.role,
        },
      },
    };

    await DI.table.insert(rowToInsert);

    res.status(200).json({ message: "success" });

    // cache the user to redis
    await DI.redis.set(newUser.key, JSON.stringify(newUser), {
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
    let user: User;

    // check if user is cached
    const cachedUser = await DI.redis.get(`user#${name}`);

    if (cachedUser) {
      user = JSON.parse(cachedUser) as User;
    } else {
      const [dbuser] = await DI.table.row(`user#${name}`).get();

      user = {
        key: `user#${name}`,
        name: dbuser.data.name.value[0].value,
        email: dbuser.data.email.value[0].value,
        password: dbuser.data.password.value[0].value,
        role: dbuser.data.role.value[0].value,
      } as User;

      // save user to cache
      await DI.redis.set(user.key, JSON.stringify(user), {
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
