# hlpf-env-setup



\## Student

\- Name: Завадський М.Р.

\- Group: 232/1он

## Практичне заняття №2 — NestJS + PostgreSQL + Redis

## Структура репозиторію
```
.
├── src/              	# NestJS source code
├── Dockerfile
├── docker-compose.yml
├── .env.example      	# шаблон змінних оточення
└── README.md
```
 
## Запуск проекту
```bash
cp .env.example .env   # налаштувати значення
docker compose up --build
```
 
## Перевірка сервісів
```text
docker compose ps
NAME                        IMAGE                COMMAND                  SERVICE    CREATED          STATUS                    PORTS
hlpf-env-setup-app-1        hlpf-env-setup-app   "docker-entrypoint.s…"   app        17 minutes ago   Up 40 seconds             0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
hlpf-env-setup-postgres-1   postgres:16-alpine   "docker-entrypoint.s…"   postgres   21 minutes ago   Up 21 minutes (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
hlpf-env-setup-redis-1      redis:7-alpine       "docker-entrypoint.s…"   redis      21 minutes ago   Up 21 minutes (healthy)   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp
```
 
## Перевірка PostgreSQL
```text
                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 nestdb    | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 postgres  | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           |
 template0 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
 template1 | nestuser | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/nestuser          +
           |          |          |                 |            |            |            |           | nestuser=CTc/nestuser
(4 rows)```
 
## Перевірка Redis
```text
<вивід docker compose exec redis redis-cli ping>
PONG
```
 
## Перевірка застосунку
```text
curl http://localhost:3000/
StatusCode        : 200
StatusDescription : OK
Content           : Hello World!
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 12
                    Content-Type: text/html; charset=utf-8
                    Date: Sun, 22 Mar 2026 21:27:46 GMT
```
 
## Логи NestJS (фрагмент)
```text
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [NestFactory] Starting Nest application...
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +67ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +46ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [RoutesResolver] AppController {/}: +5ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [RouterExplorer] Mapped {/, GET} route +3ms
app-1  | [Nest] 29  - 03/22/2026, 9:25:24 PM     LOG [NestApplication] Nest application successfully started +2ms
```



