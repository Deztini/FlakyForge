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
exports.ClassifierService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
exports.ClassifierService = {
    classifyFlakyTests(tests) {
        return __awaiter(this, void 0, void 0, function* () {
            const fallback = new Map();
            tests.forEach((t) => fallback.set(t.id, {
                id: t.id,
                label: "async wait",
                confidence: 0,
                all_scores: {},
            }));
            const itemsToClassify = tests.filter((t) => t.testCode.trim().length > 0);
            if (itemsToClassify.length === 0)
                return fallback;
            try {
                const response = yield axios_1.default.post(`${env_1.env.CLASSIFIER_URL}/classify`, {
                    items: itemsToClassify.map((t) => ({
                        id: t.id,
                        test_code: t.testCode,
                    })),
                }, { timeout: 60000 });
                const resultMap = new Map();
                response.data.results.forEach((item) => resultMap.set(item.id, item));
                return resultMap;
            }
            catch (err) {
                console.error("Classifier service error:", err);
                return fallback;
            }
        });
    },
};
