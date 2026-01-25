# API Documentation

This documentation covers the authentication, issue management, and bookmarking endpoints for the application.

---

## 🚀 Base URL
`http://https://contributionhub-backend.onrender.com`

---

## 🛠 General APIs

### Health Check
Verify if the server is running.

* **Endpoint:** `/health`
* **Method:** `GET`
* **Response:**
    ```json
    {
      "response": "ok"
    }
    ```

---

## 🔐 Authentication APIs

The application uses **GitHub OAuth** for user authentication.

### GitHub Login
Initiates the OAuth flow.

* **Endpoint:** `/auth/github`
* **Method:** `GET`
* **Scope:** `user:email`
* **Action:** Redirects the user to GitHub.

### GitHub Callback
Handles the return from GitHub after user authorization.

* **Endpoint:** `/auth/github/callback`
* **Method:** `GET`

### Get Logged-in User `🔒`
Retrieves details of the currently authenticated user.

* **Endpoint:** `/api/auth/user`
* **Method:** `GET`
* **Requirement:** Requires valid session/token.
* **Response:**
    ```json
    {
      "ok": true,
      "user": {} //an object having user-details
    }
    ```

### Logout `🔒`
Terminates the current user session.

* **Endpoint:** `/api/logout`
* **Method:** `DELETE`
* **Requirement:** Requires valid session/token.
* **Response:**
    ```json
    {
      "ok": true,
      "message": "Logged out successfully"
    }
    ```

---

## 📋 Issues APIs

### Get Issues
Fetches issues to be displayed in the application. Data is sourced from the [GitHub Issues API](https://api.github.com/search/issues).

* **Endpoint:** `/api/issues`
* **Method:** `GET`
* **Response:**
    ```json
    {
      "ok": true,
      "issues": {
          "id": "Number",
          "title": "String",
          "description": "String",
          "repo": "String",
          "difficulty": "String",
          "comments": "Number",
          "url": "String",
          "createdAt": "Date",
          "updatedAt": "Date",
      }
    }
    ```

---

## 🔖 Bookmarks APIs

All bookmark endpoints require authentication (`🔒`).

### Get Bookmarked Issues
Fetch all issues saved by the logged-in user.

* **Endpoint:** `/api/bookmarks`
* **Method:** `GET`
* **Response:**
    ```json
    { "ok": true,
      "issues": "[{}]" //array of issue objects
    }
    ```

### Create Bookmark
Add an issue to the user's saved list.

* **Endpoint:** `/api/bookmarks`
* **Method:** `POST`
* **Body:**
    ```json
    {
      "issueId": "Number"
    }
    ```
* **Response:**
    ```json
    {
      "ok": true,
      "bookmark": {
          "userId": "Number"
          "issues": "[{}]" // array of issue objects
      } 
    }
    ```

### Delete Bookmark
Remove a saved issue by its unique ID.

* **Endpoint:** `/api/bookmarks/:id`
* **Method:** `DELETE`
* **URL Params:** `id=[ Number | String ]`

---

## 📝 Notes
* **External API:** GitHub REST API is used for fetching real-time issue data.
* **Rate Limiting:** Authenticated requests are used to ensure higher GitHub API rate limits.
* **Security:** Endpoints marked with `🔒` are protected by middleware.
