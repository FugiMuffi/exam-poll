package mongo

import (
	"context"
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/env"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetClient() *mongo.Client {

	var err error
	var client *mongo.Client
	opts := options.Client()
	opts.ApplyURI(env.ExamUri)
	opts.SetMaxPoolSize(5)
	if client, err = mongo.Connect(context.Background(), opts); err != nil {
		fmt.Println(err.Error())
	}
	return client
}
