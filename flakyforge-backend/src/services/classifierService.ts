import axios from "axios";
import { env } from "../config/env";

interface ClassifyItem {
  id: string;
  label: "async wait" | "concurrency" | "network";
  confidence: number;
  all_scores: Record<string, number>;
}

interface ClassifyResponse {
  results: ClassifyItem[];
}

export const ClassifierService = {
  async classifyFlakyTests(
    tests: { id: string; testCode: string }[],
  ): Promise<Map<string, ClassifyItem>> {
    const fallback = new Map<string, ClassifyItem>();
    tests.forEach((t) =>
      fallback.set(t.id, {
        id: t.id,
        label: "async wait",
        confidence: 0,
        all_scores: {},
      }),
    );

    const itemsToClassify = tests.filter((t) => t.testCode.trim().length > 0);

    if (itemsToClassify.length === 0) return fallback;

    try {
      const response = await axios.post<ClassifyResponse>(
        `${env.CLASSIFIER_URL}/classify`,
        {
          items: itemsToClassify.map((t) => ({
            id: t.id,
            test_code: t.testCode,
          })),
        },
        { timeout: 60000 },
      );

      const resultMap = new Map<string, ClassifyItem>();
      response.data.results.forEach((item) => resultMap.set(item.id, item));

      return resultMap;
    } catch (err) {
      console.error("Classifier service error:", err);
      return fallback;
    }
  },
};
