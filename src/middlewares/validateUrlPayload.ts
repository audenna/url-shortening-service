import { Request, Response, NextFunction } from "express";
import validator from "validator";

export const validateUrlPayload = (req: Request, res: Response, next: NextFunction): void => {
    const { url } = req.body;

    if (!url) {
        res.status(400).send({ error: "URL is required" });
        return;
    }

    if (!validator.isURL(url, { require_protocol: true })) {
        res.status(400).send({ error: "Invalid URL format. Ensure it includes the protocol (http or https) and has a .com, .net, etc" });
        return;
    }

    next();
};
