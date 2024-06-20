import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const prisma = new PrismaClient();

export async function authenticateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      username: req.body.username,
    },
  });
  if (!existingUser) {
    return res.status(411).json({
      msg: "User doesn't exist",
    });
  }
  next();
}
