import { Router } from "express";

import {
  createPost,
  destroyPost,
  renderAllPost,
  renderEditForm,
  renderNewForm,
  showPost,
  updatePost,
} from "../controllers/posts.js";
import { verifyJWT } from "../middleware/auth.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = Router();

router.route("/new").get(verifyJWT, renderNewForm).post(isLoggedIn, createPost);

router.get("/", isLoggedIn, renderAllPost);

router
  .route("/:id")
  .get(isLoggedIn, showPost)
  .put(isLoggedIn, updatePost)
  .delete(isLoggedIn, destroyPost);

router.get("/:id/edit", isLoggedIn, renderEditForm);

export default router;
