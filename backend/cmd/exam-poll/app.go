package main

import (
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/app"
	"github.com/trivo25/exam-poll/backend/internal/cron"
)

func main() {
	go func() {
		err := cron.InitCron()
		if err != nil {
			fmt.Println(err)
		}
	}()
	app.InitiateExamPoll()
}
