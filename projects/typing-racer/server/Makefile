# Makefile

protoc: 
	cd idl && protoc --go_out=../protogen/golang --go_opt=paths=source_relative ./**/*.proto

game-manager:
	go run ./src/game-manager/main.go
