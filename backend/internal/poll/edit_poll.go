package poll

import (
	"context"
	"errors"
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/env"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

func HandlePollEdit(p Poll) (Poll, error) {

	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database(env.ExamDatabase).Collection(env.ExamCollection)
	ctx := context.Background()

	tempPoll, err := GetExistingPoll(p.Idt)
	if tempPoll.EditCode != p.EditCode {
		fmt.Println(p.EditCode)
		fmt.Println(tempPoll.EditCode)
		return Poll{}, errors.New("sorry, wrong edit code")
	}
	if err != nil {
		return Poll{}, errors.New("some 222error occurred casting your vote")
	}

	tempPoll.Description = p.Description
	tempPoll.Title = p.Title
	/*	tempPoll.Duration = p.Duration*/

	var result Poll

	err = collection.FindOneAndReplace(ctx, bson.M{"idt": tempPoll.Idt}, bson.M{
		"idt":          tempPoll.Idt,
		"title":        tempPoll.Title,
		"description":  tempPoll.Description,
		"end_time":     tempPoll.EndTime,
		"cur_time":     tempPoll.CurTime,
		"duration":     tempPoll.Duration,
		"results":      tempPoll.Results,
		"participants": tempPoll.Participants,
		"edit":         tempPoll.EditCode,
	}).Decode(&result)

	if err != nil {
		return Poll{}, errors.New("some error editing the poll")
	}

	return tempPoll, nil
}
