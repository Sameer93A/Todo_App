import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

const signupBody = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

app.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "inpute are not correct",
    });
  }
  const createUser = await prisma.user.create({
    data: {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    },
  });
  if (!createUser) {
    return res.status(411).json({
      msg: "Error while create a data",
    });
  }
  res.status(200).json({
    msg: "user created successfully",
  });
});

app.get("todos", (req, res) => {
  res.send("hello how are you");
});

app.listen(3000);
