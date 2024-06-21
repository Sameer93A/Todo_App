"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateMiddleware = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function authenticateMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield prisma.user.findFirst({
            where: {
                username: req.headers["username"],
            },
        });
        if (!existingUser) {
            return res.status(411).json({
                msg: "User doesn't exist",
            });
        }
        req.user = existingUser;
        next();
    });
}
exports.authenticateMiddleware = authenticateMiddleware;
