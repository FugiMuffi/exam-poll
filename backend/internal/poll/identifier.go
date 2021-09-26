package poll

import (
	"fmt"
	"math/rand"
	"time"
)

func CreateIdentifier(length int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, length)
	rand.Read(b)
	return fmt.Sprintf("%x", b)[:length]

}