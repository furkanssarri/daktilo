# Backend Concepts

- JWT authentication & authorization,
- Role-based access control (RBAC)
- Prisma & PostgreSQL storage

## Implemented Endpoints

```ts
// shared

POST    /api/auth/signup/
GET     /api/auth/signup/
POST    /api/auth/login/
GET     /api/auth/login/
GET     /api/auth/logout/

// admin

GET     /api/admin/users/
PUT     /api/admin/users/:id/
```
