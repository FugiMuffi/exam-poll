package vote

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Response struct {
	Error     string
	ErrorCode int
	Type      string
	Data      interface{}
}

func CastNewVote(w http.ResponseWriter, r *http.Request) {

	var vote Vote

	vote.Time = time.Now().Unix()
	err := json.NewDecoder(r.Body).Decode(&vote)
	if err != nil {
		fmt.Println(err)
	}

	poll, err := HandleVoteCast(vote)

	w.Header().Set("Content-Type", "application/json")

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{
			Error:     err.Error(),
			ErrorCode: 500,
			Type:      "failure",
			Data:      nil,
		})
		return
	} else {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(Response{
			Error:     "",
			ErrorCode: 200,
			Type:      "success",
			Data:      poll,
		})
		return
	}
}
