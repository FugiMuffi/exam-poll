package poll

import (
	"context"
	"errors"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

func GetExistingPoll(idt string) (Poll, error) {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database("test-exam").Collection("exam-polls") /* TODO: col name .env */
	ctx := context.Background()

	var poll Poll
	err := collection.FindOne(ctx, bson.M{"idt": idt}).Decode(&poll)

	if err != nil {
		return Poll{}, errors.New("the requested poll doesn't seem to exist")
	}

	return poll, nil
}
