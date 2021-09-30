export type GetPollData = {
  "title": string,
  "description": string,
  "fingerprint": string,
  "duration": string,
  "end_time": number,
  "cur_time": number,
  "idt": string,
  "results": {
    "Grade": {
      [option: string]: number
    }
  }
}

export type GetPoll = {
  "Error": string,
  "ErrorCode": number,
  "Type": "success" | "failure",
  "Data": GetPollData
};
