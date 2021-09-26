package handler

import (
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/poll"
	"net/http"
)

func HandleNewPoll(http.ResponseWriter, *http.Request) {
	newIdt := poll.CreateIdentifier(6)
	fmt.Println(newIdt)
}