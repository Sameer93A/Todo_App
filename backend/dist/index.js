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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const middleware_1 = require("./middleware");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const signupBody = zod_1.z.object({
    username: zod_1.z.string(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request body: ", req.body);
    const { success } = signupBody.safeParse(req.body);
    console.log("Parse result:", success);
    if (!success) {
        return res.status(411).json({
            msg: "inpute are not correct",
        });
    }
    const createUser = yield prisma.user.create({
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
}));
app.post("/createTodo", middleware_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createTodo = yield prisma.todo.create({
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
}));
app.get("/todos/:username", middleware_1.authenticateMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield prisma.todo.findMany({
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
}));
app.listen(3000);
