FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o backend-go main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/backend-go .
EXPOSE 8080
CMD ["./backend-go"]
