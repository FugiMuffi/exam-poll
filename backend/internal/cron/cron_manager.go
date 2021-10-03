package cron

import (
	"context"
	"errors"
	"fmt"
	"github.com/jasonlvhit/gocron"
	"github.com/trivo25/exam-poll/backend/internal/env"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"github.com/trivo25/exam-poll/backend/internal/poll"
	"go.mongodb.org/mongo-driver/bson"
	mongo2 "go.mongodb.org/mongo-driver/mongo"
	"log"
	"time"
)

/*

if poll.State == "closed" {
		return false
	}

*/

func InitCron() error {

	fmt.Println("Initializing cron jobs..")
	err := gocron.Every(10).Second().From(gocron.NextTick()).Do(RefreshPollState)

	if err != nil {
		return errors.New("couldn't start cron routine.")
	}

	<-gocron.Start()

	return nil
}

func RefreshPollState() error {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database(env.ExamDatabase).Collection(env.ExamCollection) /* TODO: col name .env */
	ctx := context.Background()

	cur, err := collection.Find(ctx, bson.M{"state": "active"})

	if err != nil {
		log.Fatal(err)
	}
	defer func(cur *mongo2.Cursor, ctx context.Context) {
		err := cur.Close(ctx)
		if err != nil {

		}
	}(cur, ctx)
	for cur.Next(ctx) {
		var p poll.Poll
		err := cur.Decode(&p)

		if p.EndTime <= time.Now().Unix() {
			updatePoll(p)
		}

		if err != nil {
			log.Fatal(err)
		}
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	return nil
}

func updatePoll(p poll.Poll) {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database(env.ExamDatabase).Collection(env.ExamCollection)
	ctx := context.Background()

	var result poll.Poll

	err := collection.FindOneAndReplace(ctx, bson.M{"idt": p.Idt}, bson.M{
		"idt":          p.Idt,
		"title":        p.Title,
		"description":  p.Description,
		"end_time":     p.EndTime,
		"cur_time":     p.CurTime,
		"duration":     p.Duration,
		"results":      p.Results,
		"participants": p.Participants,
		"edit":         p.EditCode,
		"state":        "closed",
	}).Decode(&result)

	if err != nil {
		return
	}

}
