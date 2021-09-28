package poll

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"time"
)

type Response struct {
	Error     string
	ErrorCode int
	Type      string
	Data      interface{}
}

func HandleGetPoll(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	poll, err := GetExistingPoll(vars["idt"])

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

func HandleNewPoll(w http.ResponseWriter, r *http.Request) {

	var request Poll

	request.CurTime = time.Now().Unix()
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		fmt.Println(err)
	}

	poll, err := HandlePollCreation(request)

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
