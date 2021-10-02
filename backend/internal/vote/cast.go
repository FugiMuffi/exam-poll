package vote

import (
	"context"
	"errors"
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/env"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"github.com/trivo25/exam-poll/backend/internal/poll"
	"go.mongodb.org/mongo-driver/bson"
)

func HandleVoteCast(vote Vote) (poll.Poll, error) {
	if verifyVote(vote.Fingerprint, vote.Idt, vote.Grade) {

		newpoll, err := castVote(vote.Fingerprint, vote.Idt, vote.Grade)
		if err != nil {
			return poll.Poll{}, errors.New("some error occurred casting your vote")
		}
		return newpoll, nil
	}
	return poll.Poll{}, errors.New("some error occurred casting your vote")
}

func castVote(fingerprint string, idt string, grade string) (poll.Poll, error) {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database(env.ExamDatabase).Collection(env.ExamCollection)
	ctx := context.Background()

	newPoll, err := poll.GetExistingPoll(idt)
	if err != nil {
		return poll.Poll{}, errors.New("some error occurred casting your vote")
	}

	newPoll.Participants[fingerprint] = grade
	newPoll.Results[grade] += 1

	var result poll.Poll
	err = collection.FindOneAndReplace(ctx, bson.M{"idt": idt}, bson.M{
		"idt":          newPoll.Idt,
		"title":        newPoll.Title,
		"description":  newPoll.Description,
		"end_time":     newPoll.EndTime,
		"cur_time":     newPoll.CurTime,
		"duration":     newPoll.Duration,
		"results":      newPoll.Results,
		"participants": newPoll.Participants,
		"edit":         newPoll.EditCode,
	}).Decode(&result)

	if err != nil {
		return poll.Poll{}, errors.New("some error occurred casting your vote")
	}
	newPoll.EditCode = ""
	return newPoll, nil

}

func verifyVote(fingerprint string, idt string, vote string) bool {

	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database(env.ExamDatabase).Collection(env.ExamCollection)
	ctx := context.Background()

	var poll poll.Poll
	err := collection.FindOne(ctx, bson.M{"idt": idt}).Decode(&poll)
	if err != nil {
		return false
	}
	participants := poll.Participants
	_, exist := participants[fingerprint]
	fmt.Println(exist)
	if exist {
		return false
	}

	votes := poll.Results
	_, exist = votes[vote]

	if !exist {
		return false
	}

	if poll.State == "closed" {
		return false
	}
	return true
}
