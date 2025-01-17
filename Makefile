DB_URL=postgresql://root:secret@localhost:5433/Bidnow?sslmode=disable

postgres:
	docker run --name postgres -p 5433:5432 -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=root -d postgres:14-alpine

createdb:
	docker exec -it postgres createdb --username=root --owner=root Bidnow

dropdb:
	docker exec -it postgres dropdb Bidnow

compose-up:
	docker-compose up -d
compose-down:
	docker-compose down 

	

.PHONY: postgres createdb dropdb
