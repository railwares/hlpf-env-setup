# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## Практичне заняття №7 — Redis + Pagination + Filtering
 
### Запуск проекту
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm app npm run seed
```
 
### API: GET /api/products
 
| Параметр | Тип | Default | Опис |
|----------|-----|---------|------|
| page | number | 1 | Номер сторінки |
| pageSize | number | 10 | Елементів на сторінку (max 100) |
| sort | string | created_at | Поле сортування |
| order | asc/desc | desc | Напрямок |
| categoryId | number | - | Фільтр за категорією |
| minPrice | number | - | Мінімальна ціна |
| maxPrice | number | - | Максимальна ціна |
| search | string | - | Пошук за назвою (ILIKE) |
 
### Тест пагінації
```text
StatusCode        : 200
StatusDescription : OK
Content           : {"data":{"items":[{"id":21,"name":"iPhone 16 v3","description":null,"price":"1019.00","stock":50,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:3...      
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 1501
                    Content-Type: application/json; charset=utf-8
                    Date: Sun, 10 May 2026 00:53:48 GMT
                    ETag: W/"5dd-YCF+sIqvLWNbpGtZs...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 1501], [Content-Type, application/json; charset=utf-8]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 1501
```
 
### Тест фільтрації
```text
curl.exe -s "http://localhost:3000/api/products?categoryId=1&minPrice=500"
{"data":{"items":[{"id":24,"name":"iPad Air v3","description":null,"price":"619.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.769Z","updatedAt":"2026-05-10T00:33:07.769Z"},{"id":23,"name":"MacBook Pro v3","description":null,"price":"2519.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.767Z","updatedAt":"2026-05-10T00:33:07.767Z"},{"id":22,"name":"Galaxy S24 v3","description":null,"price":"869.00","stock":40,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.766Z","updatedAt":"2026-05-10T00:33:07.766Z"},{"id":21,"name":"iPhone 16 v3","description":null,"price":"1019.00","stock":50,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.765Z","updatedAt":"2026-05-10T00:33:07.765Z"},{"id":14,"name":"iPad Air v2","description":null,"price":"609.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.756Z","updatedAt":"2026-05-10T00:33:07.756Z"},{"id":13,"name":"MacBook Pro v2","description":null,"price":"2509.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.755Z","updatedAt":"2026-05-10T00:33:07.755Z"},{"id":12,"name":"Galaxy S24 v2","description":null,"price":"859.00","stock":40,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.753Z","updatedAt":"2026-05-10T00:33:07.753Z"},{"id":11,"name":"iPhone 16 v2","description":null,"price":"1009.00","stock":50,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.751Z","updatedAt":"2026-05-10T00:33:07.751Z"},{"id":4,"name":"iPad Air","description":null,"price":"599.00","stock":30,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.738Z","updatedAt":"2026-05-10T00:33:07.738Z"},{"id":3,"name":"MacBook Pro","description":null,"price":"2499.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.736Z","updatedAt":"2026-05-10T00:33:07.736Z"}],"meta":{"page":1,"pageSize":10,"total":12,"totalPages":2}},"statusCode":200,"timestamp":"2026-05-10T00:59:03.567Z"}
```
 
### Тест пошуку
```text
{"data":{"items":[{"id":23,"name":"MacBook Pro v3","description":null,"price":"2519.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.767Z","updatedAt":"2026-05-10T00:33:07.767Z"},{"id":13,"name":"MacBook Pro v2","description":null,"price":"2509.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.755Z","updatedAt":"2026-05-10T00:33:07.755Z"},{"id":3,"name":"MacBook Pro","description":null,"price":"2499.00","stock":15,"isActive":true,"category":{"id":1,"name":"Electronics","description":null,"createdAt":"2026-05-10T00:33:07.726Z"},"createdAt":"2026-05-10T00:33:07.736Z","updatedAt":"2026-05-10T00:33:07.736Z"}],"meta":{"page":1,"pageSize":10,"total":3,"totalPages":1}},"statusCode":200,"timestamp":"2026-05-10T00:59:16.901Z"}
```
 
### Тест кешування (Redis)
```text
1) "products:{\"page\":1,\"pageSize\":10,\"sort\":\"createdAt\",\"order\":\"desc\",\"search\":\"mac\"}"  
```
 
### Тест інвалідації кешу
```text
data                                                                                                                                                 statusCode timestamp
----                                                                                                                                                 ---------- ---------
@{id=31; name=Fresh Product; description=; price=42; stock=0; isActive=True; createdAt=2026-05-10T00:50:02.583Z; updatedAt=2026-05-10T00:50:02.583Z}        201 2026-05-10T00:50:02.596Z


PS C:\Users\coolt\hlpf-env-setup> docker compose exec redis redis-cli KEYS "products:*"
(empty array)
```

