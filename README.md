# Tax Calculator

A simple, containerized Tax Calculator web application built for the **Cloud
Native, DevOps, Agile, and NoSQL — Final Project**. It demonstrates unit
testing with Jasmine, containerization with Docker, deployment to IBM Cloud
Code Engine, and CI/CD automation with Tekton.

> **Note:** The tax calculation implemented here is a simplified,
> illustrative progressive-bracket model for demonstration purposes only.
> It does **not** represent the real tax law of any country. See
> `src/taxCalculator.js` for the documented assumptions.

---

## Project Structure

```
tax-calculator/
├── public/
│   ├── index.html        # Frontend UI
│   ├── style.css         # Styling
│   └── app.js             # Frontend logic (calls /api/calculate)
├── src/
│   └── taxCalculator.js   # Core tax calculation logic (unit tested)
├── spec/
│   ├── support/
│   │   └── jasmine.json   # Jasmine configuration
│   └── taxCalculatorSpec.js  # 7 Jasmine unit tests
├── tekton/
│   ├── tasks.yaml          # Tekton Tasks (install, test, build, deploy)
│   └── pipeline.yaml       # Tekton Pipeline chaining the tasks
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
├── server.js               # Express server (health check + API + static files)
├── AGILE.md                 # Epic and user stories
├── SUBMISSION_CHECKLIST.md   # Evidence checklist for the 10 grading criteria
└── README.md
```

---

## Prerequisites

- Node.js 18+ and npm
- Docker
- An IBM Cloud account with:
  - IBM Cloud CLI (`ibmcloud`) installed
  - `container-registry` and `code-engine` plugins installed
- Access to a Kubernetes/OpenShift cluster with Tekton Pipelines installed
  (e.g. via the lab environment provided by the course), OR IBM Cloud Code
  Engine's native pipeline support if that is what your lab uses.
- A GitHub account (to host the source repository)

---

## Installation (local)

```bash
git clone <YOUR_GITHUB_URL>
cd tax-calculator
npm install
```

## Running Locally

```bash
npm start
```

The application will be available at:

```
http://localhost:8080
```

Health check:

```bash
curl http://localhost:8080/health
```

## Running Tests

```bash
npm test
```

This runs `jasmine` against `spec/taxCalculatorSpec.js` and should print:

```
7 specs, 0 failures
```

---

## Docker

### Build the image

```bash
docker build -t tax-calculator .
```

### Run the container

```bash
docker run -p 8080:8080 tax-calculator
```

Then open:

```
http://localhost:8080
```

Stop the container with `Ctrl+C`, or find and stop it with:

```bash
docker ps
docker stop <CONTAINER_ID>
```

---

## GitHub

This project does not include a pre-made GitHub URL — create your own
repository and push:

```bash
# From inside the tax-calculator directory
git init
git add .
git commit -m "Initial commit: Tax Calculator"

# Create a new empty repository on https://github.com/new first, then:
git branch -M main
git remote add origin <YOUR_GITHUB_URL>
git push -u origin main
```

---

## IBM Cloud Container Registry

Replace the placeholders below with your own values before running.

```bash
# 1. Log in to IBM Cloud
ibmcloud login --sso
# or: ibmcloud login -a https://cloud.ibm.com -u <USERNAME>

# 2. Target the correct region
ibmcloud target -r <YOUR_IBM_REGION>

# 3. Log the local Docker daemon into IBM Container Registry
ibmcloud cr login

# 4. (One-time) create a namespace if you don't already have one
ibmcloud cr namespace-add <YOUR_REGISTRY_NAMESPACE>

# 5. Tag the locally built image for IBM Container Registry
docker tag tax-calculator \
  <YOUR_IBM_REGION>.icr.io/<YOUR_REGISTRY_NAMESPACE>/tax-calculator:1.0

# 6. Push the image
docker push <YOUR_IBM_REGION>.icr.io/<YOUR_REGISTRY_NAMESPACE>/tax-calculator:1.0

# 7. Confirm the push
ibmcloud cr image-list
```

---

## IBM Cloud Code Engine

```bash
# 1. Select or create a Code Engine project
ibmcloud ce project select --name <YOUR_CE_PROJECT_NAME>
# or, if it doesn't exist yet:
ibmcloud ce project create --name <YOUR_CE_PROJECT_NAME>

# 2. Deploy the container image as an application
ibmcloud ce application create \
  --name tax-calculator \
  --image <YOUR_IBM_REGION>.icr.io/<YOUR_REGISTRY_NAMESPACE>/tax-calculator:1.0 \
  --port 8080 \
  --registry-secret <YOUR_REGISTRY_SECRET_NAME>

# 3. Get the generated application URL
ibmcloud ce application get --name tax-calculator -o url

# 4. Test the deployed application
curl <YOUR_CODE_ENGINE_URL>/health
```

Capture the real, generated `<YOUR_CODE_ENGINE_URL>` value from your own
terminal output — do not use a placeholder in your final submission.

---

## Tekton CI/CD Pipeline

See the full step-by-step procedure in `SUBMISSION_CHECKLIST.md`, Tasks 7–10.
Summary:

```bash
# Apply the Tasks
kubectl apply -f tekton/tasks.yaml

# Apply the Pipeline
kubectl apply -f tekton/pipeline.yaml

# Start a PipelineRun (example using tkn CLI)
tkn pipeline start tax-calculator-pipeline \
  --workspace name=shared-workspace,claimName=<YOUR_PVC_NAME> \
  --param IMAGE=<YOUR_IBM_REGION>.icr.io/<YOUR_REGISTRY_NAMESPACE>/tax-calculator:pipeline \
  --param CE_PROJECT=<YOUR_CE_PROJECT_NAME> \
  --param CE_APP_NAME=tax-calculator \
  --showlog

# Monitor an in-progress or past run
tkn pipelinerun logs --last -f
```

The pipeline is structured so that the `build` and `deploy` tasks only run
`runAfter` the `test` task completes successfully — a failing Jasmine suite
stops the pipeline before any image is built or deployed.

---

## License

MIT — for educational/demonstration use.
