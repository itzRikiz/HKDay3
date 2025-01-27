# JSON Web Token (JWT) - Simplified Guide

## What is JWT?
JSON Web Token (JWT) is a compact and secure way to transmit information between two parties (client and server) as a JSON object. It's widely used for authentication and authorization.

---

## Structure of JWT
A JWT consists of three parts, separated by dots (`.`):

```
Header.Payload.Signature
```

### 1. Header:
Contains metadata about the token, such as the type of token and signing algorithm used.

Example:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload:
Contains the claims (data) you want to transmit. This can include user information, roles, or other metadata.

Example:
```json
{
  "userName": "testuser",
  "exp": 1672531199
}
```

### 3. Signature:
Used to verify that the token is not tampered with. It is generated using the header, payload, and a secret key.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

---

## How JWT Works

1. **User Authentication**:
   - User logs in with credentials (e.g., username and password).
   - Server verifies credentials and generates a JWT.
   - The JWT is sent back to the client.

2. **Token Storage**:
   - The client stores the token (e.g., in local storage or cookies).

3. **Making Requests**:
   - For every request, the client includes the JWT in the `Authorization` header.
     ```
     Authorization: Bearer <token>
     ```

4. **Token Verification**:
   - The server verifies the token using the secret key.
   - If valid, the server processes the request; otherwise, it rejects it.

---

## Example JWT Workflow (Code)

### Server Code Example:

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "your_secret_key";

app.use(express.json());

// Mock users database
const users = [];

// Signup Route
app.post("/signup", (req, res) => {
  const { userName, password } = req.body;
  if (users.find((u) => u.userName === userName)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ userName, password });
  res.json({ message: "Signup successful" });
});

// Signin Route
app.post("/signin", (req, res) => {
  const { userName, password } = req.body;
  const user = users.find((u) => u.userName === userName && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userName }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected Route
app.get("/me", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token is missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ userName: decoded.userName });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Key Points

1. **Stateless:**
   - JWTs are stateless; no need to store them on the server.

2. **Authorization Header:**
   - Always send the token in the `Authorization` header: `Bearer <token>`.

3. **Token Expiry:**
   - Tokens should have an expiry time to enhance security.

4. **Do Not Store Sensitive Data in Payload:**
   - Payload is base64-encoded, not encrypted. Anyone with the token can decode it.

5. **Use HTTPS:**
   - Always use HTTPS to prevent token interception.

---

## Debugging Tips

- Use tools like [jwt.io](https://jwt.io/) to decode and debug tokens.
- Log incoming headers on the server to verify if the token is being sent.
  ```javascript
  console.log("Headers:", req.headers);
  ```
- Handle token expiry gracefully and inform the client to refresh or reauthenticate.

---

## When to Use JWT?
- Stateless authentication in web or mobile applications.
- API authorization.
- Single sign-on (SSO).

---

## Pros and Cons of JWT

### Pros:
- Compact and efficient.
- Stateless (no server storage).
- Cross-platform compatibility.

### Cons:
- If compromised, anyone can access protected resources until expiry.
- Cannot easily revoke a token without additional measures.
- Larger size compared to traditional session IDs.

---

This document provides a simplified overview of JWTs for quick understanding and reference.

