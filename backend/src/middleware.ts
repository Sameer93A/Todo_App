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
      username: req.headers["username"] as string,
    },
  });
  if (!existingUser) {
    return res.status(411).json({
      msg: "User doesn't exist",
    });
  }
  req.user = existingUser;
  next();
}
