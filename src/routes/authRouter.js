import { Router } from "express";
import { getUserByUsername } from "../services/userService.js";
import crypto from "crypto";

const authRouter = Router();

// GET login
authRouter.get("/login", (req, res) => {
    res.render("login.pug");
});

// POST login
authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Brugernavn og password er påkrævet"
            });
        }

        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(400).json({
                error: "Forkert brugernavn eller password"
            });
        }

        const hashedPassword = crypto
            .createHash("sha256")
            .update(password)
            .digest("hex");

        if (user.password !== hashedPassword) {
            return res.status(400).json({
                error: "Forkert brugernavn eller password"
            });
        }

        req.session.userId = user.userid;
        req.session.userLevel = user.level;

        return res.redirect("/chats");

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Serverfejl"
        });
    }
});

// POST logout
authRouter.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                error: "Kunne ikke logge ud"
            });
        }

        res.redirect("/login");
    });
});

export default authRouter;