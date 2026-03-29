# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## Практичне заняття №2 — NestJS + PostgreSQL + Redis

## Структура репозиторію
```
.
├── src/
│   ├── categories/
│   │   ├── category.entity.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── categories.controller.ts
│   ├── products/
│   │   ├── product.entity.ts
│   │   ├── products.module.ts
│   │   ├── products.service.ts
│   │   └── products.controller.ts
│   ├── migrations/
│   │   ├── 1700000001-CreateTables.ts
│   │   └── <timestamp>-AddIsActiveToProducts.ts
│   ├── data-source.ts
│   └── app.module.ts
├── Dockerfile
├── docker-compose.yml
└── README.md

```
 
## Запуск проекту
```bash
cp .env.example .env   # налаштувати значення
docker compose up --build
```
 
### API Endpoints
| Method | URL | Опис |
|--------|-----|------|
| GET | /api/categories | Список категорій |
| GET | /api/categories/:id | Одна категорія |
| POST | /api/categories | Створити категорію |
| PATCH | /api/categories/:id | Оновити категорію |
| DELETE | /api/categories/:id | Видалити категорію |
| GET | /api/products | Список продуктів |
| GET | /api/products/:id | Один продукт |
| POST | /api/products | Створити продукт |
| PATCH | /api/products/:id | Оновити продукт |
| DELETE | /api/products/:id | Видалити продукт |
 
### Перевірка міграцій
```text
List of relations
 Schema |    Name    | Type  |  Owner
--------+------------+-------+----------
 public | categories | table | nestuser
 public | migrations | table | nestuser
 public | products   | table | nestuser
(3 rows)
```
 
### Тест створення категорії
```text
{
    "id":  6,
    "name":  "Smartphones",
    "description":  "Mobile devices",
    "createdAt":  "2026-03-29T22:19:11.284Z"
}
```
 
### Тест створення продукту
```text
{
    "id":  3,
    "name":  "MacBook Air",
    "description":  null,
    "price":  1200,
    "stock":  15,
    "isActive":  true,
    "category":  {
                     "id":  1
                 },
    "createdAt":  "2026-03-29T22:23:16.831Z",
    "updatedAt":  "2026-03-29T22:23:16.831Z"
}
```
 
### Тест отримання продуктів
```text
{
    "value":  [
                  {
                      "id":  1,
                      "name":  "iPhone 15",
                      "description":  null,
                      "price":  "899.99",
                      "stock":  45,
                      "isActive":  true,
                      "category":  {
                                       "id":  1,
                                       "name":  "Electronics",
                                       "description":  "Gadgets and devices",
                                       "createdAt":  "2026-03-29T21:56:51.662Z"
                                   },
                      "createdAt":  "2026-03-29T22:12:24.943Z",
                      "updatedAt":  "2026-03-29T22:14:16.169Z"
                  },
                  {
                      "id":  3,
                      "name":  "MacBook Air",
                      "description":  null,
                      "price":  "1200.00",
                      "stock":  15,
                      "isActive":  true,
                      "category":  {
                                       "id":  1,
                                       "name":  "Electronics",
                                       "description":  "Gadgets and devices",
                                       "createdAt":  "2026-03-29T21:56:51.662Z"
                                   },
                      "createdAt":  "2026-03-29T22:23:16.831Z",
                      "updatedAt":  "2026-03-29T22:23:16.831Z"
                  }
              ],
    "Count":  2
}
```
 
### Тест 404
```text
Invoke-RestMethod : {"message":"Product #999 not found","error":"Not Found","statusCode":404}
```




