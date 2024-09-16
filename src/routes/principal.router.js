import { Router } from "express";
import {
  rendeLetter,
  renderAbout,
  renderFAQ,
  renderPrincipal,
  renderProductDetails,
  renderProductbyQuery,
} from "../controllers/principalController.js";

const router = Router();

router.get("/", renderPrincipal);
router.get("/about", renderAbout);
router.get("/letter", rendeLetter);
router.get("/faq", renderFAQ);
router.get("/letter/query", renderProductbyQuery);
router.get("/detail/:id", renderProductDetails);

export default router;
