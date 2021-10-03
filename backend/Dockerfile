FROM golang:1.17 AS build

WORKDIR /build
COPY . .
RUN CGO_ENABLED=0 go build -o backend cmd/exam-poll/app.go

FROM scratch
COPY --from=build /build/backend /usr/local/bin/backend

CMD ["/usr/local/bin/backend"]
