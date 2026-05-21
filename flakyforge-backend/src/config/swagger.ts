import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.2.0",
    info: {
      title: "FlakeyRadar API",
      version: "1.0.0",
      description:
        "FlakeyRadar is a flaky test detection and automated fix platform. This API powers the dashboard, repository management, test run collection, and AI-driven fix application.",
    },
    servers: [
      {
        url: "https://flakeyradar.onrender.com/api",
        description: "Production server",
      },
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
      schemas: {
        SignupRequest: {
          type: "object",
          required: ["email", "password", "fullName"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "password123" },
            fullName: { type: "string", example: "John Doe" },
            role: { type: "string", example: "Developer" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        OtpRequest: {
          type: "object",
          required: ["email", "code"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            code: { type: "string", example: "123456" },
          },
        },
        ResendOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", example: "john@example.com" },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["newPassword", "confirmNewPassword"],
          properties: {
            newPassword: { type: "string", example: "newpassword123$" },
            confirmNewPassword: { type: "string", example: "cnewpassword123$" },
          },
        },

        ConnectRepoRequest: {
          type: "object",
          required: ["repoFullName", "githubRepoId", "language", "stars", "branch"],
          properties: {
            repoFullName: { type: "string", example: "Deztini/flaky-test-repo-1" },
            githubRepoId: { type: "number", example: 1241817467 },
            language: { type: "string", nullable: true, example: "JavaScript" },
            stars: { type: "number", example: 0 },
            branch: { type: "string", example: "main" },
            scanTrigger: {
              type: "string",
              enum: ["push", "pull_request", "scheduled", "workflow_dispatch"],
              example: "push",
            },
            autoFixPRs: { type: "boolean", example: false },
          },
        },

        ApplyFixRequest: {
          type: "object",
          required: ["testRunId", "flakyTestId"],
          properties: {
            testRunId: { type: "string", example: "6a0dbc7f035b89de954f5cf9" },
            flakyTestId: { type: "string", example: "6a0dbcba0ff773f41567d005" },
          },
        },

        CollectResultsRequest: {
          type: "object",
          required: ["githubRepoId", "repoFullName", "commitSha", "totalTests", "results"],
          properties: {
            githubRepoId: { type: "number", example: 1241817467 },
            repoFullName: { type: "string", example: "Deztini/flaky-test-repo-1" },
            commitSha: { type: "string", example: "abc1234" },
            totalTests: { type: "number", example: 12 },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  failRate: { type: "number" },
                  testCode: { type: "string" },
                  runs: { type: "number" },
                  isFlaky: { type: "boolean" },
                  file: { type: "string" },
                },
              },
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            total: { type: "number" },
            page: { type: "number" },
            limit: { type: "number" },
            totalPages: { type: "number" },
            hasNext: { type: "boolean" },
            hasPrev: { type: "boolean" },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Repositories", description: "GitHub repository management" },
      { name: "Test Runs", description: "Test run triggers and results" },
      { name: "Flaky Tests", description: "Flaky test detection and fixes" },
      { name: "Pull Requests", description: "Pull request tracking" },
      { name: "Dashboard", description: "Dashboard summary and metrics" },
    ],
    paths: {

      "/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            201: { description: "Account created. OTP sent to email." },
            400: { description: "Email already in use" },
          },
        },
      },
      "/auth/verify-otp": {
        post: {
          tags: ["Auth"],
          summary: "Verify OTP code",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OtpRequest" },
              },
            },
          },
          responses: {
            201: { description: "Email verified successfully" },
            400: { description: "Invalid or expired OTP" },
          },
        },
      },
      "/auth/resend-otp": {
        post: {
          tags: ["Auth"],
          summary: "Resend OTP code",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResendOtpRequest" },
              },
            },
          },
          responses: {
            201: { description: "OTP resent successfully" },
            404: { description: "No account found with this email" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login with email and password",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            201: {
              description:
                "Login successful. Sets accessToken and refreshToken cookies.",
            },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/github": {
        get: {
          tags: ["Auth"],
          summary: "Initiate GitHub OAuth login",
          security: [],
          responses: {
            302: { description: "Redirects to GitHub OAuth" },
          },
        },
      },
      "/auth/github/callback": {
        get: {
          tags: ["Auth"],
          summary: "GitHub OAuth callback",
          security: [],
          responses: {
            302: { description: "Redirects to frontend with cookies set" },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Request password reset OTP",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResendOtpRequest" },
              },
            },
          },
          responses: {
            201: { description: "Reset OTP sent to email" },
            404: { description: "No account found" },
          },
        },
      },
      "/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Reset password using resetToken cookie",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
              },
            },
          },
          responses: {
            201: { description: "Password reset successful" },
            401: { description: "Reset session expired" },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token using refreshToken cookie",
          responses: {
            200: { description: "New tokens issued" },
            401: { description: "Invalid or missing refresh token" },
          },
        },
      },
      "/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout and clear cookies",
          responses: {
            200: { description: "Logged out successfully" },
          },
        },
      },
      "/auth/check": {
        get: {
          tags: ["Auth"],
          summary: "Check if user is authenticated",
          responses: {
            200: { description: "Returns authenticated user info" },
            401: { description: "Not authenticated" },
          },
        },
      },


      "/repo/available": {
        get: {
          tags: ["Repositories"],
          summary: "Get available GitHub repos not yet connected",
          responses: {
            200: { description: "List of available repositories" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/repo": {
        get: {
          tags: ["Repositories"],
          summary: "Get all connected repositories",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", example: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", example: 10 },
            },
          ],
          responses: {
            200: { description: "Connected repositories with pagination" },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["Repositories"],
          summary: "Connect a GitHub repository",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ConnectRepoRequest" },
              },
            },
          },
          responses: {
            201: { description: "Repository connected and workflow injected" },
            400: { description: "Repository already connected" },
          },
        },
      },

      "/test-runs/results": {
        post: {
          tags: ["Test Runs"],
          summary: "Collect test results from GitHub Actions workflow",
          description:
            "Called by the injected workflow script. Authenticated via x-api-key header, not cookies.",
          security: [],
          parameters: [
            {
              in: "header",
              name: "x-api-key",
              required: true,
              schema: { type: "string" },
              description: "Repo-specific API key injected during setup",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CollectResultsRequest",
                },
              },
            },
          },
          responses: {
            201: { description: "Results collected and classification started" },
            401: { description: "Invalid API key" },
          },
        },
      },
      "/test-runs": {
        get: {
          tags: ["Test Runs"],
          summary: "Get all test runs for the authenticated user",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", example: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", example: 10 },
            },
          ],
          responses: {
            200: { description: "List of test runs with pagination" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/test-runs/metrics": {
        get: {
          tags: ["Test Runs"],
          summary: "Get test run metrics",
          responses: {
            200: {
              description:
                "Total runs, runs today, success rate, avg duration",
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/test-runs/{repoId}/trigger": {
        post: {
          tags: ["Test Runs"],
          summary: "Manually trigger a scan for a repository",
          parameters: [
            {
              in: "path",
              name: "repoId",
              required: true,
              schema: { type: "string" },
              description: "The MongoDB ID of the connected repository",
            },
          ],
          responses: {
            201: { description: "Scan triggered successfully" },
            404: { description: "Repository not found" },
          },
        },
      },

      "/flaky-tests": {
        get: {
          tags: ["Flaky Tests"],
          summary: "Get all flaky tests with pagination and optional filter",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", example: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", example: 10 },
            },
            {
              in: "query",
              name: "status",
              schema: {
                type: "string",
                enum: ["unfixed", "pending", "fixed"],
              },
              description: "Filter by fix status",
            },
          ],
          responses: {
            200: { description: "Flaky tests with pagination" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/flaky-tests/metrics": {
        get: {
          tags: ["Flaky Tests"],
          summary: "Get flaky test metrics breakdown",
          responses: {
            200: {
              description: "Total, fixed, pending, unfixed counts and fix rate",
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/flaky-tests/apply-fix": {
        post: {
          tags: ["Flaky Tests"],
          summary: "Apply automated fix and open a GitHub PR",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplyFixRequest" },
              },
            },
          },
          responses: {
            201: { description: "PR opened successfully" },
            404: { description: "Test or repository not found" },
            409: { description: "Fix already applied or pending" },
            422: { description: "No automated fix available for this type" },
          },
        },
      },


      "/pull-requests": {
        get: {
          tags: ["Pull Requests"],
          summary: "Get all fix pull requests",
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", example: 1 },
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", example: 10 },
            },
            {
              in: "query",
              name: "state",
              schema: {
                type: "string",
                enum: ["open", "merged", "closed"],
              },
              description: "Filter by PR state",
            },
          ],
          responses: {
            200: { description: "Pull requests with pagination" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/pull-requests/metrics": {
        get: {
          tags: ["Pull Requests"],
          summary: "Get pull request metrics",
          responses: {
            200: { description: "Total, open, merged, closed counts" },
            401: { description: "Unauthorized" },
          },
        },
      },


      "/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get dashboard summary stats",
          responses: {
            200: {
              description:
                "Total tests, flaky tests, fixed count, avg confidence",
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/dashboard/flaky-tests/trends": {
        get: {
          tags: ["Dashboard"],
          summary: "Get weekly flaky test detection and fix trend",
          responses: {
            200: { description: "Day-by-day detected vs fixed counts" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/dashboard/flaky-tests/root-cause": {
        get: {
          tags: ["Dashboard"],
          summary: "Get root cause breakdown by flaky type",
          responses: {
            200: {
              description:
                "Breakdown of async wait, concurrency, network percentages",
            },
            401: { description: "Unauthorized" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);