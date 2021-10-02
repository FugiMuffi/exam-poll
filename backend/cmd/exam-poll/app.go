package main

import (
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/app"
	"github.com/trivo25/exam-poll/backend/internal/cron"
	"github.com/trivo25/exam-poll/backend/internal/env"
)

func main() {

	env.InitEnv()

	go func() {
		err := cron.InitCron()
		if err != nil {
			fmt.Println(err)
		}
	}()
	app.InitiateExamPoll()
}
