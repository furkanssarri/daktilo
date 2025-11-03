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

// users public
GET     /api/users/me
PUT     /api/users/me
PUT     /api/users/me/password        //reset password

// posts public
GET     /api/posts
GET     /api/posts/:slug
GET     /api/posts/:id/comments

// posts authenticated
POST    /api/posts/:id/like
POST    /api/posts/:id/comment

// posts admin - post management
POST    /api/admin/posts
PUT     /api/admin/posts/:id
DELETE  /api/admin/posts/:id
GET     /api/admin/posts              // including unpublished
GET     /api/admin/posts/:id          // including unpublished
PUT     /api/admin/posts/:id/publish  // publish unpublished post
```
