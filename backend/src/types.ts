// types.ts

import { Request } from "express";
import { User } from "@prisma/client"; // Assuming 'User' is the type from Prisma

declare module "express" {
  interface Request {
    user?: User; // Define 'user' as optional and of type 'User'
  }
}
