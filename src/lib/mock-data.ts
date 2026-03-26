import type { Workspace, Comment } from "@/types/workspace";

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Add user authentication",
    repo_path: "/home/dev/myapp",
    base: "main",
    head: "feature/auth",
    status: "TO_REVIEW",
    created_at: "2026-03-25T10:00:00Z",
    comments: [
      { id: "c1", file: "src/auth/login.go", line: 12, text: "Should we add rate limiting here?", created_at: "2026-03-25T11:00:00Z" },
      { id: "c2", file: "src/auth/login.go", line: 25, text: "Nice use of context propagation.", created_at: "2026-03-25T11:05:00Z" },
      { id: "c3", text: "Overall looks good, just a few minor things.", created_at: "2026-03-25T12:00:00Z" },
    ],
  },
  {
    id: "ws-2",
    name: "Fix database connection pooling",
    repo_path: "/home/dev/myapp",
    base: "main",
    head: "fix/db-pool",
    status: "ACCEPTED",
    created_at: "2026-03-24T08:00:00Z",
    comments: [
      { id: "c4", text: "LGTM! Pool size looks reasonable.", created_at: "2026-03-24T09:00:00Z" },
    ],
  },
  {
    id: "ws-3",
    name: "Refactor API middleware",
    repo_path: "/home/dev/api-service",
    base: "develop",
    head: "refactor/middleware",
    status: "REQUIRE_CHANGES",
    created_at: "2026-03-23T14:00:00Z",
    comments: [
      { id: "c5", file: "middleware/cors.go", line: 8, text: "This allows all origins — needs to be restricted in production.", created_at: "2026-03-23T15:00:00Z" },
      { id: "c6", file: "middleware/logging.go", line: 31, text: "Consider using structured logging instead of fmt.Println.", created_at: "2026-03-23T15:10:00Z" },
      { id: "c7", text: "Please address the CORS and logging concerns before merging.", created_at: "2026-03-23T16:00:00Z" },
    ],
  },
  {
    id: "ws-4",
    name: "Remove legacy payment handler",
    repo_path: "/home/dev/payments",
    base: "main",
    head: "cleanup/legacy-payments",
    status: "DECLINED",
    created_at: "2026-03-22T09:00:00Z",
    comments: [
      { id: "c8", text: "We still have clients on the v1 API — can't remove this yet.", created_at: "2026-03-22T10:00:00Z" },
    ],
  },
];

export const MOCK_DIFF = `diff --git a/src/auth/login.go b/src/auth/login.go
new file mode 100644
index 0000000..a1b2c3d
--- /dev/null
+++ b/src/auth/login.go
@@ -0,0 +1,35 @@
+package auth
+
+import (
+	"context"
+	"errors"
+	"net/http"
+	"time"
+)
+
+type LoginRequest struct {
+	Email    string \`json:"email"\`
+	Password string \`json:"password"\`
+}
+
+func HandleLogin(w http.ResponseWriter, r *http.Request) {
+	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
+	defer cancel()
+
+	var req LoginRequest
+	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
+		http.Error(w, "invalid request body", http.StatusBadRequest)
+		return
+	}
+
+	user, err := FindUserByEmail(ctx, req.Email)
+	if err != nil {
+		http.Error(w, "authentication failed", http.StatusUnauthorized)
+		return
+	}
+
+	if !CheckPasswordHash(req.Password, user.PasswordHash) {
+		http.Error(w, "authentication failed", http.StatusUnauthorized)
+		return
+	}
+
+	token, err := GenerateJWT(user)
diff --git a/src/auth/session.go b/src/auth/session.go
index 1234567..89abcde 100644
--- a/src/auth/session.go
+++ b/src/auth/session.go
@@ -10,7 +10,9 @@ func CreateSession(userID string) (*Session, error) {
 	return &Session{
 		ID:        generateID(),
 		UserID:    userID,
-		ExpiresAt: time.Now().Add(24 * time.Hour),
+		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
+		CreatedAt: time.Now(),
+		IsSecure:  true,
 	}, nil
 }
`;

export function shouldUseMock(): boolean {
  return config.useMockData;
}
