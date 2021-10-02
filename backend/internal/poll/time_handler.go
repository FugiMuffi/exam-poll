package poll

import (
	"errors"
)

func parseTime(start int64, ts string) (int64, error) {
	switch ts {
	case "4h":
		return start + (3600 * 4), nil
	case "8h":
		return start + (3600 * 8), nil
	case "12h":
		return start + (3600 * 12), nil
	case "1d":
		return start + (3600 * 24), nil
	case "2d":
		return start + (3600 * 48), nil
	case "4d":
		return start + (3600 * 96), nil
	case "7d":
		return start + (3600 * 168), nil
	}
	return 0, errors.New("bad end time input")
}
