# Golang basics

## Run file
```bash
go run <file-name>.go	# Run a single Go file immediately
go mod init github.com/callezenwaka/golang	# Initialize a Go module (creates go.mod)
go run .	# Run all Go files in current directory as a program
go build	# Build all Go files into an executable binary
```

## Build
```bash
go build && ./<file-name>
```

## Env
```bash
go get github.com/joho/godotenv
go mod vendor
go mod tidy
```