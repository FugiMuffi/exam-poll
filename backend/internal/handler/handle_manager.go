package handler

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/trivo25/exam-poll/backend/internal/poll"
	"github.com/trivo25/exam-poll/backend/internal/vote"
	"net/http"
	"os"
	"strings"
	"time"
)

func RequestHandler() {

	fmt.Println("Initializing http server..")
	r := mux.NewRouter()

	r.HandleFunc("/createPoll", poll.HandleNewPoll)
	r.HandleFunc("/getPoll/{idt}", poll.HandleGetPoll)
	r.HandleFunc("/castVote", vote.CastNewVote)
	r.HandleFunc("/editPoll", poll.HandleEditPoll)
	http.Handle("/", r)

	corsList := os.Getenv("EXAM_POLL_CORS_LIST")
	cr := strings.Split(corsList, ",")

	c := cors.New(cors.Options{
		AllowedOrigins:   cr,
		AllowCredentials: true,
	})
	h := c.Handler(r)

	httpListenAddress := os.Getenv("EXAM_POLL_HTTP_LISTEN")

	srv := &http.Server{
		Handler: h,
		Addr:    httpListenAddress, WriteTimeout: 15 * time.Second,
		ReadTimeout: 15 * time.Second,
	}

	err := srv.ListenAndServe()

	if err != nil {
		fmt.Println("some error has occurred creating the http server")
	}

}
