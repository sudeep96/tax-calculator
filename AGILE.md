# Agile Planning — Tax Calculator Modernization

## Epic

**Title:** Modernise Tax Calculator

**Description:**
The Tax Calculator currently runs as a manually deployed static application and lacks a robust pipeline in place. This epic focuses on modernizing the application to deploy it on IBM Cloud. The web application will be containerized using Docker, and deployment will be managed through a pipeline that ensures all unit tests pass before deployment.

---

## User Stories

### Story 1 — Containerizing the application

**Description:**
To ensure that each unit of code performs as expected, run unit tests. If the unit tests pass, deploy the application to a Docker container.

**Acceptance criteria:**
- Jasmine unit tests exist and cover the core tax calculation logic.
- `npx jasmine` runs the full suite and reports `7 specs, 0 failures`.
- A `Dockerfile` exists that builds a runnable image of the application.
- The containerized application is reachable at `http://localhost:8080`.

---

### Story 2 — Deploying on IBM Cloud

**Description:**
Instead of hosting on self-managed or in-house virtual machines, deploy the application on IBM Cloud using IBM Cloud Code Engine.

**Acceptance criteria:**
- The Docker image is tagged and pushed to IBM Cloud Container Registry.
- The image is deployed as an application in IBM Cloud Code Engine.
- The deployed application is reachable via its generated Code Engine URL.
- The `/health` endpoint returns a successful response on the deployed instance.

---

### Story 3 — Creating a pipeline for packaging and deploying the application

**Description:**
The current process of packaging and deploying involves too many manual steps. Use a Tekton pipeline to automate the build, test, and packaging stages of the application.

**Acceptance criteria:**
- Tekton `Task` resources exist for: installing dependencies, running Jasmine tests, building the Docker image, and deploying to Code Engine.
- A Tekton `Pipeline` chains these tasks in the correct order using `runAfter`.
- The pipeline does **not** proceed to build/deploy if the unit test task fails.
- A `PipelineRun` can be started and monitored, producing real, observable logs for each task.

---

## Workflow Summary

```
source/application
      │
      ▼
install dependencies   (Story 1 / Story 3)
      │
      ▼
run Jasmine tests       (Story 1 / Story 3)
      │
      ▼ (only if tests pass)
build Docker image      (Story 1 / Story 3)
      │
      ▼
push to IBM Container Registry   (Story 2)
      │
      ▼
deploy to IBM Cloud Code Engine  (Story 2 / Story 3)
```
