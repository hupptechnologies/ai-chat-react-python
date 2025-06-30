# AI Chat React + Python (FastAPI) Project

## Project Description
This project is a full-stack, Dockerized AI chat application featuring a React (Vite) frontend and a FastAPI backend. The backend provides both REST and WebSocket APIs for real-time chat, leveraging OpenAI's API for AI responses. The frontend offers a modern, responsive chat interface with asynchronous state management and real-time updates.

## How to Run the Project

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your system.
- An OpenAI API key (for backend AI functionality).

### 1. Clone the Repository
```bash
git clone <repo-url>
cd ai-chat-react-python
```

### 2. Set Up Environment Variables
#### Backend
- In the `backend` directory, create a `.env` file with the following content:
  ```env
  OPENAI_API_KEY=your-openai-api-key-here
  DATABASE_URL=sqlite+aiosqlite:///./ai_chat.db      # Optionally override the default database URL
  ```

#### Frontend
- In the `frontend` directory, create a `.env` file with:
  ```env
  VITE_API_BASE_URL=http://localhost:8000
  ```
  Adjust the URL if your backend runs elsewhere.

### 3. Build and Run with Docker Compose
From the project root, run:
```bash
docker-compose up --build
```
- The frontend will be available at [http://localhost:3000](http://localhost:3000)
- The backend API will be available at [http://localhost:8000](http://localhost:8000)

## Running Tests

### Backend
From the `backend` directory:
```bash
# Run all tests
./run_tests.sh
```

## Design Choices

### WebSocket API Design
- The backend uses FastAPI's WebSocket support to enable real-time, bidirectional communication for chat. This allows instant delivery of AI responses and user messages, providing a seamless chat experience.
- The `/ws/chat` endpoint streams AI responses as they are generated, improving perceived responsiveness.

### Asynchronous State Management (Frontend)
- The frontend leverages React's built-in hooks (`useState`, `useEffect`, `useReducer`) for local state and uses WebSocket for real-time updates.
- Asynchronous actions (e.g., sending/receiving messages) are managed with custom hooks and effectful logic, ensuring UI stays in sync with backend events.

### Linting and Code Quality
- **Frontend:** Uses ESLint (with TypeScript and React plugins) and Prettier for code quality and formatting. Husky and lint-staged enforce standards on commit.
- **Backend:** Uses Black, isort, mypy, and Ruff for Python code formatting, import sorting, type checking, and linting.
- These tools were chosen for their strong ecosystem support, speed, and ability to catch common issues early in development.

### Tooling Rationale
- **Vite** was chosen for its fast development server and modern build tooling for React.
- **FastAPI** was selected for its async support, automatic docs, and WebSocket capabilities.
- **Docker Compose** orchestrates multi-container setup, simplifying local development and deployment.
