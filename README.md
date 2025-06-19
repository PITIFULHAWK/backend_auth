# Bun.js Authentication Backend

This project is a robust backend for an authentication system, built with Bun.js, Express, TypeScript, and MongoDB. It handles user registration, login, logout, and fetching user profiles with secure password hashing and JWT-based authentication.

---

## 🚀 Tech Stack

* **Runtime**: [Bun.js](https://bun.sh/) - An incredibly fast all-in-one JavaScript runtime, bundler, and package manager.
* **Web Framework**: [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js (compatible with Bun).
* **Language**: [TypeScript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript that compiles to plain JavaScript.
* **Database**: [MongoDB](https://www.mongodb.com/) - A NoSQL, document-oriented database.
* **ODM**: [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js (compatible with Bun).
* **Password Hashing**: [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - Library for hashing and comparing passwords securely.
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) - For stateless authentication.
* **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - For containerizing the application and database for easy setup and deployment.

---

## 🛠️ Setup Instructions

This guide provides instructions for three ways to run the application: running locally, running the backend in Docker with an external MongoDB, and running both backend and MongoDB using Docker Compose.

### Prerequisites (General)

* **[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)**: For cloning the repository.
* **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: Includes Docker Engine and Docker Compose (required for Docker-based setups).

### 1. Clone the Repository

```bash
git clone https://github.com/PITIFULHAWK/backend_auth.git
cd backend_auth
```

### 2. Create the `.env` File

Create a file named `.env` in the root of your project directory. This file will hold your environment variables.
**Note:** Some variables might be overridden depending on your chosen running method.

```dotenv
# .env
# --- Application Port Configuration ---
# HOST_PORT: The port on your local machine that maps to the container's port (for Docker).
# BACKEND_PORT: The port your backend application listens on *inside* the container/process.
HOST_PORT=3000
BACKEND_PORT=3000

# --- JWT Secret for Authentication ---
# IMPORTANT: Replace this with a strong, random, and unique secret key.
# You can generate one using a tool like: node -c "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_very_secure_jwt_secret_here_replace_me_with_a_long_random_string

# --- MongoDB Connection URI ---
# Default for Docker Compose setup (service-to-service communication)
# For local setup, this might need to be 'mongodb://localhost:27017/myauthapp'
# For Docker single-container setup, this will be your external MongoDB URL.
MONGO_URL=mongodb://mongodb:27017/myauthapp

```

**Remember to replace `your_very_secure_jwt_secret_here_replace_me_with_a_long_random_string` with a truly random and secure key.**

---

## 🚀 Running the Application

Choose one of the following methods to run the application:

### Option A: Running Locally (Without Docker Containers for Backend)

This method runs your Bun.js backend directly on your host machine, connecting to a locally installed MongoDB instance (or a MongoDB container run separately, e.g., `docker run -p 27017:27017 --name my-local-mongo mongo:latest`).

#### Additional Prerequisites for Local Run:

* **[Bun.js](https://bun.sh/docs/installation)** (recommended compatible version)
* **[MongoDB](https://www.mongodb.com/try/download/community)** (Community Server installed locally, or a separate MongoDB Docker container running and exposed on `localhost:27017`).

#### Steps:

1.  **Ensure MongoDB is running locally:** Start your local MongoDB server (or run `docker run -p 27017:27017 --name my-local-mongo mongo:latest`).

2.  **Modify your `.env` for local MongoDB:**
    Open your `.env` file and set `MONGO_URL` to point to your local MongoDB instance:
    ```dotenv
    # .env
    # ... other variables ...
    MONGO_URL=mongodb://localhost:27017/myauthapp # <--- IMPORTANT: For local run
    # ...
    ```

3.  **Install dependencies using Bun:**
    ```bash
    bun install
    ```

4.  **Run the application in development mode:**
    ```bash
    bun run dev
    ```
    (This assumes you have a `dev` script in your `package.json` like `bun --watch src/app.ts`)

    Your backend should start and connect to your local MongoDB. Access it at `http://localhost:3000`.

---

### Option B: Running Backend with Docker (Connecting to External MongoDB)

This method runs *only* your Bun.js backend in a Docker container, but it connects to an external MongoDB database (e.g., a cloud provider like MongoDB Atlas or a MongoDB instance running on a different server).

#### Steps:

1.  **Obtain an External MongoDB URI:**
    * **Placeholder:** `mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority`
    * **Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>`** with your actual MongoDB Atlas (or other cloud MongoDB) connection string details.

2.  **Modify your `.env` for external MongoDB:**
    Open your `.env` file and set `MONGO_URL` to your external MongoDB connection string:
    ```dotenv
    # .env
    # ... other variables ...
    MONGO_URL=mongodb+srv://yourUser:yourPassword@yourcluster.mongodb.net/yourAuthDb?retryWrites=true&w=majority # <--- IMPORTANT: For external MongoDB
    # ...
    ```

3.  **Build the Docker image for your backend:**
    ```bash
    docker build -t my-auth-backend .
    ```

4.  **Run the Docker container, passing environment variables:**
    ```bash
    docker run -p 3000:3000 \
               -e MONGO_URL="${MONGO_URL}" \
               -e JWT_SECRET="${JWT_SECRET}" \
               my-auth-backend
    ```
    * Replace `${MONGO_URL}` and `${JWT_SECRET}` with your actual values (or ensure they are set as shell environment variables before running this command). For simplicity, you can hardcode them here for testing if preferred, but `.env` is better.
    * `JWT_SECRET` is crucial and must be set.
    * `NODE_ENV` is important for cookie security (e.g., `secure: true` in production).

    Your backend should start within the container and connect to the specified external MongoDB. Access it at `http://localhost:3000`.

---

### Option C: Running with Docker Compose (Backend + MongoDB)

This is the recommended method for local development as it brings up both your backend and a dedicated MongoDB instance together, isolated within Docker containers.

#### Steps:

1.  **Ensure Docker Desktop is running.**

2.  **Verify your `.env` file for Docker Compose:**
    Ensure your `.env` file has `MONGO_URL` set to `mongodb://mongodb:27017/myauthapp` as shown in the initial `.env` example, or simply remove the `MONGO_URL` line from `.env` to let the default from `docker-compose.yml` apply.
    `JWT_SECRET` must be defined in your `.env` file or passed directly in the command.

3.  **Run Docker Compose:**
    Open your terminal in the root of your project directory and run:
    ```bash
    docker compose up -d --build
    ```
    * `-d`: Runs containers in detached mode.
    * `--build`: Builds (or rebuilds) your backend Docker image.

4.  **Verify Services (Optional):**
    * Check running containers: `docker compose ps`
    * View logs: `docker compose logs -f backend` (to see your backend's output)

    Your backend and MongoDB services will be running within Docker. Access your backend API at `http://localhost:3000`.

---

## 🧪 Sample Test Credentials

You can use the following credentials to test the **signup** and then **login** functionality of the API.

* **Email**: `test@example.com`
* **Password**: `password123`

### Example API Calls (using `curl`):

Replace `http://localhost:3000` with your actual backend URL if it's different.

1.  **Register a New User:**

    ```bash
    curl -X POST -c cookiejar.txt -H "Content-Type: application/json" -d '{"fullname": "Jhon Doe", "email": "jhondoe@gmail.com", "password": "jhondoe123"}' http://localhost:3000/api/auth/signup
    ```
    Expected Response: `{"message":"User created successfully", "user":{...}, "token":"..."}` (and a `token` cookie will be set)

2.  **Login User:**

    ```bash
    curl -X POST -c cookiejar.txt -H "Content-Type: application/json" -d '{"email": "jhondoe@gmail.com", "password": "jhondoe123"}' http://localhost:3000/api/auth/login
    ```
    * `-c cookiejar.txt`: Saves the response cookies (including the `token`) to `cookiejar.txt` for subsequent requests.
    Expected Response: `{"message":"Logged in successfully", "user":{...}, "token":"..."}`

3.  **Get Current User Profile (`/me` endpoint):**

    ```bash
    curl -X GET -b cookiejar.txt http://localhost:3000/api/auth/me
    ```
    * `-b cookiejar.txt`: Sends the cookies saved from the login response.
    Expected Response: `{"success":true, "data":{...}}` (your user profile data)

4.  **Logout User:**

    ```bash
    curl -X POST -c cookiejar.txt -H "Content-Type: application/json" http://localhost:3000/api/auth/logout
    ```
    Expected Response: `{"message":"Logged out successfully"}`

---

Feel free to explore the code and adapt it to your needs! Let me know if you have any questions or need further assistance.
