package env

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
)

var (
	ExamCollection = ""
	ExamDatabase   = ""
	ExamUri        = ""
)

func InitEnv() {
	err := godotenv.Load(".env.dev")
	if err != nil {
		fmt.Println("err")
	}
	ExamCollection = os.Getenv("EXAM_POLL_COLLECTION")
	ExamDatabase = os.Getenv("EXAM_POLL_DATABASE")
	ExamUri = os.Getenv("EXAM_POLL_MONGODB")
}
