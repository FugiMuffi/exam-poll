package poll

import (
	"context"
	"fmt"
	"github.com/trivo25/exam-poll/backend/internal/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"math/rand"
	"time"
)

/*
	CreateIdentifier
	creates a unique identifier of length 'length' and checks its existence with the database,
	creates a new one if it already exists, returns the identifier
*/
func CreateIdentifier(length int) string {

	rand.Seed(time.Now().UnixNano())
	b := make([]byte, length)
	rand.Read(b)
	idt := fmt.Sprintf("%x", b)[:length]
	if !checkIdentifierExistance(idt) {
		return CreateIdentifier(length)
	} else {
		return idt
	}

}

func CreateEditCode(length int) string {

	rand.Seed(time.Now().UnixNano())
	b := make([]byte, length)
	rand.Read(b)
	idt := fmt.Sprintf("%x", b)[:length]
	return idt

}

func checkIdentifierExistance(idt string) bool {
	c := mongo.GetClient()
	defer func() {
		ctx := context.Background()
		if err := c.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
	collection := c.Database("test-exam").Collection("exam-polls") /* TODO: col name .env */
	ctx := context.Background()
	amnt, err := collection.CountDocuments(ctx, bson.M{"idt": idt})
	if err != nil {
		return false
	}

	if amnt != 0 {
		return false
	}
	return true
}
