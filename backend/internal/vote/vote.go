package vote

type Vote struct {
	Idt         string `json:"idt" bson:"idt"`
	Fingerprint string `json:"fingerprint" bson:"fingerprint"`
	Time        int64  `json:"time" bson:"time"`
	Grade       string `json:"grade" bson:"grade"`
}
