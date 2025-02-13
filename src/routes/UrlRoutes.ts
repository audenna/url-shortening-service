import { Router } from "express";
import { UrlController } from "../controllers/UrlController";
import { validateUrlPayload } from "../middlewares/validateUrlPayload";
import { ValidateSocketHeader } from "../middlewares/validateSocketHeader";

const router = Router();
const urlController: UrlController = UrlController.getInstance(); // Get the singleton instance

// Define the required routes below
router.post("/url", ValidateSocketHeader, validateUrlPayload, urlController.postUrl);
router.get("/:shortCode", urlController.getUrl);

export default router;
