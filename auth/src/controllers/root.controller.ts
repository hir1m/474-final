import { Request, Response, Router } from "express";
import { DI } from "..";
import bcrypt from "bcrypt";
import { UserRole } from "../entities/user.entity";
import { sign } from "jsonwebtoken";

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

  try {
    const newUser = {
      name,
      email,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      role: UserRole.USER,
    };

    const user = DI.user.create(newUser);
    await DI.em.flush();

    return res.status(200).json({ message: "success" });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

router.post("/auth", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "name or password is undefined" });
  }
  try {
    const user = await DI.user.findOneOrFail({ name });
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "incorrect password" });
    }
    const authToken = sign(
      {
        uuid: user.uuid,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieExpiry = new Date(new Date().getTime() + 86400 * 7);
    // return res.status(200).json({ authToken });
    return res.cookie("token", authToken, {
      expires: cookieExpiry,
      httpOnly: true,
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
});

export const RootController = router;
