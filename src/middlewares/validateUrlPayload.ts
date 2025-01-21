import { Request, Response, NextFunction } from "express";
import validator from "validator";

// Middleware to validate the "url" payload
export const validateUrlPayload = (req: Request, res: Response, next: NextFunction): void => {
    const { url } = req.body;

    // Check if the URL exists in the request body
    if (!url) {
        res.status(400).send({ error: "URL is required" });
        return;
    }

    // Validate the URL format
    if (!validator.isURL(url, { require_protocol: true })) {
        res.status(400).send({ error: "Invalid URL format. Ensure it includes the protocol (http or https) and has a .com, .net, etc" });
        return;
    }

    // Proceed to the next middleware or controller if validation passes
    next();
};
