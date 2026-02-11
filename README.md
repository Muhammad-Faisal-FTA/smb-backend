express: The main web framework for Node.js that helps create server-side applications
cookieParser: Middleware to parse cookies attached to client requests (used for authentication tokens)
cors: Cross-Origin Resource Sharing middleware - allows your API to accept requests from different domains
useAuthRoute: Custom authentication routes imported from your routes folder

origin: Specifies which domain can access your API (loaded from environment variables for security)
credentials: true: Allows cookies and authentication headers to be sent with cross-origin requests
Purpose: Prevents unauthorized websites from accessing your API while allowing your frontend

express.json(): Parses incoming JSON payloads from request bodies
express.urlencoded(): Parses URL-encoded data (like HTML form submissions)
limit: "980kb": Restricts request body size to prevent abuse (nearly 1MB)

Static File Serving
javascriptapp.use(express.static("public"))
Serves static files (images, CSS, JavaScript) from the "public" folder directly to clients.
6. Cookie Parser
javascriptapp.use(cookieParser())
Parses cookies from incoming requests and makes them available in req.cookies.
7. Route Mounting
javascriptapp.use('/api/v1/auth', useAuthRoute);
app.use('/api/v1/otp', useAuthRoute);
app.use('/api/v1/pass', useAuthRoute);
app.use('/api/v1/newpass', useAuthRoute);
These lines mount your authentication routes at different base paths:

/api/v1/auth - User registration, login, logout
/api/v1/otp - OTP verification endpoints
/api/v1/pass - Forgot password functionality
/api/v1/newpass - Reset password functionality

Note: All four routes use the same useAuthRoute router, which should internally handle different endpoints.
8. Export
javascriptexport default app;
Exports the configured app to be used in your main server file (typically server.js or index.js).

### Common Viva Questions & Answers:
Q: Why use middleware?
A: Middleware functions process requests before they reach route handlers, enabling code reuse for common tasks like parsing, authentication, and logging.
Q: What's the order of middleware?
A: Order matters! Middleware executes top-to-bottom. Body parsers must come before routes that need to access req.body.
Q: Why set a body limit?
A: To prevent DoS attacks where attackers send extremely large payloads to overwhelm your server.
Q: What does credentials: true do?
A: It allows cookies to be sent with cross-origin requests, essential for authentication flows using HTTP-only cookies.
Q: Why use environment variables for CORS_ORIGIN?
A: For security and flexibility - you can allow different origins in development vs production without code changes.Claude is AI and can make mistakes. Please double-check responses.  Sonnet 4.5