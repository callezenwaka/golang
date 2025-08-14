# Aggregator

## Database
```bash
Aggregator %
chmod +x run_migrations.sh
./run_migrations.sh
./run_migrations.sh down
./run_migrations.sh up
sqlc generate
```

## Build and run project
```bash
Aggregator %
go build && ./Aggregator
```

## Install project dependencies
```bash
golang %
go get <github/username/repository>
go mod vendor && go mod tidy
```