# E-commerce Backend (Spring Boot)

- Maven + Java 17
- H2 in-memory database

Endpoints:
- Products: GET/POST/PUT/DELETE /api/products
- Cart: GET /api/cart, POST /api/cart/items?productId=&quantity=, PUT /api/cart/items/{productId}?quantity=, DELETE /api/cart/items/{productId}, POST /api/cart/clear

Run:
- mvn spring-boot:run
- H2 console: http://localhost:8080/h2-console

Integration tip with Angular:
- Use `http://localhost:8080/api/products` for product operations
- Cart endpoints mirror the methods in `src/app/panier.service.ts` and can be used instead of localStorage once you switch to a server-backed cart.
