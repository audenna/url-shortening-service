import { Router } from "express";
import { UrlController } from "../controllers/urlController";
import { validateUrlPayload } from "../middlewares/validateUrlPayload";

const router = Router();
const urlController = UrlController.getInstance(); // Get the singleton instance

// Define the required routes below
router.post("/url", validateUrlPayload, urlController.postUrl);
router.get("/:shortCode", urlController.getUrl);

export default router;
