import { Router } from "express";
import {
  getMasterList,
  createMasterRecord,
  deleteMasterRecord,
} from "../controllers/mastersController";

const router = Router();

router.get("/:type", getMasterList);
router.post("/:type", createMasterRecord);
router.delete("/:type/:id", deleteMasterRecord);

export default router;
