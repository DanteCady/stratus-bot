# Use an official Go image as a base
FROM golang:1.21-alpine

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set the working directory
WORKDIR /app

# Copy Go modules and dependencies first (for caching layers)
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code
COPY . .

# Build the Go application
RUN go build -o stratus-backend ./main.go

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["/app/stratus-backend"]
