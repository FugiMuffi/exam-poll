package handler

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/trivo25/exam-poll/backend/internal/poll"
	"github.com/trivo25/exam-poll/backend/internal/vote"
	"net/http"
	"time"
)

func RequestHandler() {

	fmt.Println("Initializing http server..")
	r := mux.NewRouter()

	r.HandleFunc("/createPoll", poll.HandleNewPoll)
	r.HandleFunc("/getPoll/{idt}", poll.HandleGetPoll)
	r.HandleFunc("/castVote", vote.CastNewVote)
	http.Handle("/", r)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	h := c.Handler(r)
	srv := &http.Server{
		Handler: h,
		Addr:    "127.0.0.1:8000", WriteTimeout: 15 * time.Second,
		ReadTimeout: 15 * time.Second,
	}

	err := srv.ListenAndServe()

	if err != nil {
		fmt.Println("some error has occurred creating the http server")
	}

}
