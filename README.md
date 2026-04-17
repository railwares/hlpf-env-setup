# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## Практичне заняття №4 — DTO + class-validator + Pipes
 
### Структура репозиторію
```
.
├── src/
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── common/
│   │   └── pipes/
│   │   	└── trim.pipe.ts
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
 
### Тест валідації — порожнє ім'я категорії
```text
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": ""}'
Invoke-RestMethod : {"message":["name must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
At line:1 char:1
+ Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method ...
+ ~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
```
 
### Тест валідації — від'ємна ціна продукту
```text
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "Test", "price": -5}'
Invoke-RestMethod : {"message":["price must not be less than 0.01"],"error":"Bad Request","statusCode":400}
At line:1 char:1
+ Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method P ...
+ ~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
```
 
### Тест валідації — зайве поле
```text
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "Test", "isAdmin": true}'
Invoke-RestMethod : {"message":["property isAdmin should not exist"],"error":"Bad Request","statusCode":400}
At line:1 char:1
+ Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method ...
+ ~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.HttpWebRequest:HttpWebRequest) [Invoke-RestMethod], WebException
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Microsoft.PowerShell.Commands.InvokeRestMethodCommand
```
 
### Тест TrimPipe
```text
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "  Trimmed  "}'

id name    description createdAt
-- ----    ----------- ---------
 8 Trimmed             2026-04-17T17:34:15.965Z
```
 
### Тест валідне створення продукту
```text
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name": "Valid Product", "price": 99.99, "stock": 10, "categoryId": 1}'


id          : 4
name        : Valid Product
description :
price       : 99.99
stock       : 10
isActive    : True
category    : @{id=1}
createdAt   : 2026-04-17T17:21:46.269Z
updatedAt   : 2026-04-17T17:21:46.269Z
```





