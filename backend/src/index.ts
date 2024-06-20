import express from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { authenticateMiddleware } from "./middleware";
import { log } from "console";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const signupBody = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

app.post("/signup", async (req, res) => {
  console.log("Received request body: ", req.body);
  const { success } = signupBody.safeParse(req.body);
  console.log("Parse result:", success);
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
      msg: "Error while creating a data",
    });
  }
  res.status(200).json({
    msg: "user created successfully",
  });
});

app.post("/createTodo", authenticateMiddleware, async (req, res) => {
  const createTodo = await prisma.todo.create({
    data: {
      title: req.body.title,
      description: req.body.title,
      userId: req.body.userId,
    },
  });
  if (!createTodo) {
    return res.status(411).json({
      msg: "Error while create todo",
    });
  }
  res.status(200).json({
    msg: "Todo created successfully",
  });
});

app.get("/todos/:username", authenticateMiddleware, async (req, res) => {
  const todos = await prisma.todo.findMany({
    where: {
      user: {
        username: req.params.username,
      },
    },
    select: {
      user: true,
      title: true,
      description: true,
    },
  });
  res.status(200).json({
    todos,
  });
});

app.listen(3000);
