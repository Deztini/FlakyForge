"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const repo_1 = require("../controllers/repo");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/available", repo_1.RepoController.getAvailable); // list available repos
router.get("/", repo_1.RepoController.getUserRepos); // list all user repo
router.post("/connect", repo_1.RepoController.connect); // connects repo and injects Workflow
exports.default = router;
