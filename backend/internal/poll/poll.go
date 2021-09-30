package poll

type Poll struct {
	Title        string            `json:"title" bson:"title"`
	Description  string            `json:"description"  bson:"description"`
	Fingerprint  string            `json:"fingerprint"  bson:"fingerprint"`
	Duration     string            `json:"duration"  bson:"duration"`
	EndTime      int64             `json:"end_time"  bson:"end_time"`
	CurTime      int64             `json:"cur_time"  bson:"cur_time"`
	Idt          string            `json:"idt"  bson:"idt"`
	Results      map[string]uint32 `json:"results"  bson:"results"`
	Participants map[string]string `json:"participants"  bson:"participants"`
	EditCode     string            `json:"edit"  bson:"edit"`
}
