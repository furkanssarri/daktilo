# Backend Concepts

- JWT authentication & authorization,
- Role-based access control (RBAC)
- Prisma & PostgreSQL storage

## Implemented Endpoints

```ts
// Backend API Endpoints
// Express + Prisma + JWT Auth + RBAC Architecture

// =============================
// PUBLIC ENDPOINTS
// =============================

// AUTH
POST    /api/auth/signup                     // Register a new user
POST    /api/auth/login                      // Login and receive access + refresh tokens
POST    /api/auth/refresh                    // Refresh tokens using a valid refresh token

// POSTS
GET     /api/posts                           // Get all published posts (supports ?include=)
GET     /api/posts/slug/:slug                // Get a single published post by slug
GET     /api/posts/id/:id                    // Get a single published post by ID

// CATEGORIES
GET     /api/categories                      // Get all categories
GET     /api/categories/:id                  // Get a single category by ID
GET     /api/categories/:name/posts          // Get all published posts in a category

// TAGS
GET     /api/tags                            // Get all tags
GET     /api/tags/:id                        // Get a tag by ID (includes its posts)
GET     /api/tags/:name/posts                // Get all published posts under a tag

// COMMENTS (PUBLIC)
GET     /api/comments                        // Get all approved comments
GET     /api/comments/:id                    // Get a single approved comment by ID



// =============================
// AUTHENTICATED USER ENDPOINTS
// =============================

// USER PROFILE
GET     /api/users/me                        // Get authenticated user's profile
PUT     /api/users/me                        // Update authenticated user's profile
PUT     /api/users/me/password               // Update authenticated user's password

// POSTS INTERACTIONS
POST    /api/posts/:id/like                  // Like a post
POST    /api/posts/:id/comment               // Comment on a post

// COMMENTS (USER)
POST    /api/comments                        // Create a comment (awaiting admin approval)
PUT     /api/comments/:id                    // Edit own comment (sets isApproved = false)
DELETE  /api/comments/:id                    // Delete own comment



// =============================
// ADMIN ENDPOINTS
// =============================

// POSTS (ADMIN)
POST    /api/admin/posts                     // Create a new post (auto-slugify title)
PUT     /api/admin/posts/:id                 // Update an existing post
DELETE  /api/admin/posts/:id                 // Delete a post by ID
GET     /api/admin/posts                     // Get all posts (published + unpublished)
GET     /api/admin/posts/slug/:slug          // Get a post by slug (published + unpublished)
PUT     /api/admin/posts/:id/publish         // Toggle post's publish/unpublish status

// CATEGORIES (ADMIN)
POST    /api/admin/categories                // Create a new category
PUT     /api/admin/categories/:id            // Update a category
DELETE  /api/admin/categories/:id            // Delete a category by ID

// TAGS (ADMIN)
POST    /api/admin/tags                      // Create a new tag
PUT     /api/admin/tags/:id                  // Update a tag
DELETE  /api/admin/tags/:id                  // Delete a tag by ID

// COMMENTS (ADMIN)
GET     /api/admin/comments                  // Get all comments
PUT     /api/admin/comments/:id              // Edit any comment
DELETE  /api/admin/comments/:id              // Delete any comment
PUT     /api/admin/comments/:id/approval     // Approve or disapprove a comment

// USERS (ADMIN)
GET     /api/admin/users                     // Get all users
PUT     /api/admin/users/:id                 // Update any user's profile or role

// MEDIA (ADMIN)
POST    /api/admin/posts/upload              // Upload a post image to Supabase (creates Media record)
```
