package poll

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Grades struct {
	/* ["grade", amount_of_votes] */
	Grade map[string]uint32
}

type Poll struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Fingerprint string `json:"fingerprint"`
	Duration    string `json:"duration"`
	EndTime     int64  `json:"end_time"`
	CurTime     int64  `json:"cur_time"`
	Idt         string `json:"idt"`
	Results     Grades `json:"results"`
}

type Response struct {
	Error     string
	ErrorCode int
	Type      string
	Data      interface{}
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
