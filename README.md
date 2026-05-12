# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## MiniShop API — Фінальний проєкт
 
REST API інтернет-магазину на NestJS + PostgreSQL + Redis.
 
### Технології
- NestJS + TypeScript
- PostgreSQL + TypeORM (міграції, QueryBuilder)
- Redis (кешування з інвалідацією)
- JWT автентифікація + RBAC авторизація
- class-validator + class-transformer
- Swagger / OpenAPI
 
### Запуск
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### Swagger UI
http://localhost:3000/api/docs
 
### API Endpoints
 
#### Auth
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /auth/register | - | Реєстрація |
| POST | /auth/login | - | Логін → JWT |
 
#### Categories
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/categories | - | Список |
| GET | /api/categories/:id | - | Одна |
| POST | /api/categories | admin | Створити |
| PATCH | /api/categories/:id | admin | Оновити |
| DELETE | /api/categories/:id | admin | Видалити |
 
#### Products
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| GET | /api/products | - | Список + pagination + filter |
| GET | /api/products/:id | - | Один |
| POST | /api/products | admin | Створити |
| PATCH | /api/products/:id | admin | Оновити |
| DELETE | /api/products/:id | admin | Видалити |
 
#### Orders
| Method | URL | Auth | Опис |
|--------|-----|------|------|
| POST | /api/orders | user | Створити замовлення |
| GET | /api/orders | user | Мої / Всі (admin) |
| GET | /api/orders/:id | user | Одне (ownership) |
| PATCH | /api/orders/:id/status | admin | Змінити статус |
| DELETE | /api/orders/:id | admin | Видалити |
 
### Тест створення замовлення
```text
{"data":{"id":2,"status":"pending","totalPrice":"999.00","user":{"id":1},"items":[{"id":3,"quantity":1,"price":"999.00","product":{"id":1,"name":"iPhone 16","description":null,"price":"999.00","stock":47,"isActive":true,"createdAt":"2026-05-10T00:33:07.732Z","updatedAt":"2026-05-12T21:06:48.195Z"}}],"createdAt":"2026-05-12T21:06:48.195Z"},"statusCode":201,"timestamp":"2026-05-12T21:06:48.213Z"}
```
 
### Тест ownership (403)
```text
{"error":{"code":403,"message":"You can only view your own orders","traceId":"6cbbe8aa-7fd4-4f95-a9ff-dc1020b28a46"},"timestamp":"2026-05-12T21:16:57.069Z"}
```
 
### Тест зміни статусу
```text
data                                                                                                     statusCode timestamp
----                                                                                                     ---------- ---------
@{id=1; status=confirmed; totalPrice=2847.00; items=System.Object[]; createdAt=2026-05-12T20:38:50.801Z}        200 2026-05-12T20:57:31.939Z
```
 
### Тест insufficient stock
```text
{"error":{"code":400,"message":"Insufficient stock for \"iPhone 16\": available 47, requested 99999","traceId":"b0f79270-2b57-48c1-bd1e-1fe1d12a5405"},"timestamp":"2026-05-12T21:19:15.214Z"}


