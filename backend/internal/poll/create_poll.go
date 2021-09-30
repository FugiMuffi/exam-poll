package poll

import (
	"context"
	"errors"
	"fmt"
	goaway "github.com/TwinProduction/go-away"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"reflect"
)

func HandlePollCreation(r Poll) (Poll, error) {

	v := reflect.ValueOf(r)

	for i := 0; i < v.NumField(); i++ {
		if goaway.IsProfane(fmt.Sprintf("%v", v.Field(i).Interface())) {
			return Poll{}, errors.New("Woooooow - stop right there criminal scum! There is fould language in your request")
		}
	}

	r.Results = map[string]uint32{
		"1.0": 0,
		"1.3": 0,
		"1.7": 0,
		"2.0": 0,
		"2.3": 0,
		"2.7": 0,
		"3.0": 0,
		"3.3": 0,
		"3.7": 0,
		"4.0": 0,
		"5.0": 0,
	}

	editCode := CreateEditCode(12)
	r.EditCode = editCode
	r.State = "active"
	newIdt := CreateIdentifier(6)
	r.Idt = newIdt
	r.Participants = make(map[string]string)

	endTime, err := parseTime(r.CurTime, r.Duration)
	if err != nil {
		return Poll{}, err
	}
	r.EndTime = endTime
	err = insertNewPoll(r)
	if err != nil {
		return Poll{}, err
	}

	return r, nil
}

func insertNewPoll(p Poll) error {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database("test-exam").Collection("exam-polls") /* TODO: col name .env */
	ctx := context.Background()
	_, err := collection.InsertOne(ctx,
		bson.M{
			"idt":          p.Idt,
			"title":        p.Title,
			"description":  p.Description,
			"end_time":     p.EndTime,
			"cur_time":     p.CurTime,
			"duration":     p.Duration,
			"results":      p.Results,
			"participants": p.Participants,
			"edit":         p.EditCode,
			"state":        p.State,
		})
	if err != nil {
		return errors.New("an error has occurred inserting the poll into the database")
	}

	return nil
}
