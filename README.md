# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## Практичне заняття №5 — JWT Authentication + Guards + RBAC
 
### Структура репозиторію
```
.
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   ├── enums/
│   │   │   └── role.enum.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── pipes/
│   │   	└── trim.pipe.ts
│   ├── categories/ ...
│   ├── products/ ...
│   ├── migrations/
│   ├── data-source.ts
│   ├── main.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md
```
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
```
 
### API Endpoints
| Method | URL | Auth | Role |
|--------|-----|------|------|
| POST | /auth/register | - | - |
| POST | /auth/login | - | - |
| GET | /api/categories | - | - |
| POST | /api/categories | JWT | admin |
| GET | /api/products | - | - |
| POST | /api/products | JWT | admin |
| PATCH | /api/products/:id | JWT | admin |
| DELETE | /api/products/:id | JWT | admin |
 
### Тест реєстрації
```text
<вивід curl POST /auth/register>
-Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email": "user@test.com", "password": "password123", "name": "User"}'  


id        : 2
email     : user@test.com
name      : User
role      : user
createdAt : 2026-04-20T18:49:19.487Z
```
 
### Тест логіну
```text
<вивід curl POST /auth/login>
-Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email": "user@test.com", "password": "password123"}' 

accessToken
-----------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidXNlckB0ZXN0LmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc2NzExMjcyLCJleHAiOjE3NzY3MTQ4NzJ9.TmNl2QkxOR7Ff04vbxgELff4rSXqzggHNp7AkMOjszA
```
 
### Тест 401 — запит без токена
```text
<вивід curl POST /api/products без Authorization>

id          : 1
name        : iPhone 15
description :
price       : 899.99
stock       : 45
isActive    : True
category    : @{id=1; name=Electronics; description=Gadgets and devices; createdAt=2026-03-29T21:56:51.662Z}
createdAt   : 2026-03-29T22:12:24.943Z
updatedAt   : 2026-03-29T22:14:16.169Z
```
 
### Тест 403 — запит з роллю user
```text
<вивід curl POST /api/products з токеном user>
-Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $USER_TOKEN"} -Body '{"name": "Blocked Product", "price": 99}'
Invoke-RestMethod : {"message":"Missing authorization token","error":"Unauthorized","statusCode":401}
At line:1 char:1
+ Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method P ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand

```
 
### Тест успішного створення від admin
```text
<вивід curl POST /api/products з токеном admin>
-Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $ADMIN_TOKEN"} -Body '{"name": "MacBook Pro", "price": 2499.99, "stock": 10}'
id          : 5
name        : MacBook Pro
description :
price       : 2499.99
stock       : 10
isActive    : True
createdAt   : 2026-04-20T19:00:25.004Z
updatedAt   : 2026-04-20T19:00:25.004Z
```
