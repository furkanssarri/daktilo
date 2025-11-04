# Backend Concepts

- JWT authentication & authorization,
- Role-based access control (RBAC)
- Prisma & PostgreSQL storage

## Implemented Endpoints

```ts
// shared public
POST    /api/auth/signup
GET     /api/auth/signup
POST    /api/auth/login
GET     /api/auth/login
GET     /api/auth/logout

// admin
GET     /api/admin/users
PUT     /api/admin/users/:id

// users (authenticated)
GET     /api/users/me
PUT     /api/users/me
PUT     /api/users/me/password           //reset password

// posts public
GET     /api/posts
GET     /api/posts/:slug
GET     /api/posts/:id/comments

// posts (authenticated)
POST    /api/posts/:id/like
POST    /api/posts/:id/comment

  // ---------------------------------------------

// Public
GET    /api/categories                // Get all categories
GET    /api/tags                      // Get all tags
GET    /api/categories/:name/posts    // Get posts by category
GET    /api/tags/:slug/posts          // Get posts by tag

// Admin only
POST   /api/admin/categories          // Create category
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id
POST   /api/admin/tags                // Create tag
PUT    /api/admin/tags/:id
DELETE /api/admin/tags/:id

  // ---------------------------------------------------

// posts (admin)
POST    /api/admin/posts
PUT     /api/admin/posts/:id
DELETE  /api/admin/posts/:id
GET     /api/admin/posts                // including unpublished
GET     /api/admin/posts/:id            // including unpublished
PUT     /api/admin/posts/:id/publish    // publish unpublished post

// comments (authenticated)
POST   /api/comments                    // Create comment
PUT    /api/comments/:id                // Edit own comment
DELETE /api/comments/:id                // Delete own comment

// comments (admin)
GET    /api/admin/comments              // Get all comments
DELETE /api/admin/comments/:id          // Delete any comment
PUT    /api/admin/comments/:id/approve  // Approve/disapprove comments
```
