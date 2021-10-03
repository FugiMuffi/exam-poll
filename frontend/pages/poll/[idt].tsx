import type { NextPage, GetServerSidePropsContext } from 'next'
import type { GetPoll, GetPollData } from 'types/getPoll'
import styles from 'styles/Poll.module.scss'
import Head from 'next/head'
import Error from 'next/error'
import Moment from 'react-moment'
import { useState, useEffect } from 'react'
import CreatePollForm from 'components/createPollForm'
import CastVoteForm from 'components/castVoteForm'
import VoteResults from 'components/voteResults'
//@ts-ignore
import getBrowserFingerprint from 'get-browser-fingerprint';


type Props = { data: GetPollData, idt?: string } & { errorCode: number, errorMsg?: string }

const Poll: NextPage<Props> = ({ data, idt, errorCode, errorMsg }) => {

  const checkTimerFinished = () => {
    if (!timerFinished && end_date < new Date()) setTimerFinished(true);
  }

  const castVote = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      vote: { value: string };
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/castVote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idt: data.idt,
        fingerprint: String(getBrowserFingerprint()),
        grade: form.vote.value
      })
    });

    const res: GetPoll = await response.json();
    console.log(res);

    if (res.Type == "failure") {
      alert(res.Error);
      return
    }

    if (res.Type == "success") {
      window.localStorage.setItem(res.Data.idt, form.vote.value);
      setUserVote(form.vote.value);
      setPollData(res.Data);
      setShowResults(true);
      return
    }
  }

  const editPoll = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
      duration: { value: string };
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASEURL}/editPoll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idt: data.idt,
        title: form.title.value,
        description: form.description.value,
        edit: editCode
      })
    });

    const res: GetPoll = await response.json();
    console.log(res);

    if (res.Type == "failure") {
      alert(res.Error);
      return
    }

    if (res.Type == "success") {
      setPollData(res.Data);
      setEditModalVisible(false);
      return
    }
  }

  const [pollData, setPollData] = useState(data);
  const [timerFinished, setTimerFinished] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userVote, setUserVote] = useState("");
  const [showResults, setShowResults] = useState(false);

  // componentDidMount
  useEffect(() => {
    if (window.location.hash) setEditCode(window.location.hash.replace('#', ''));

    if (idt) {
      const vote = window.localStorage.getItem(idt);
      if (vote) {
        setUserVote(vote);
        setShowResults(true);
      }
    }
  }, [idt])

  if (errorCode) return <Error statusCode={errorCode} title={errorMsg} />

  const end_date = new Date(data.end_time * 1000);
  checkTimerFinished();

  return (
    <>
      <Head>
        <title>{pollData.title}</title>
        <meta name="description" content={pollData.description} />
      </Head>

      { editCode ?
      <div id={styles.backdrop} style={{display: editModalVisible ? "flex" : "none"}}>
        <div id={styles.editModal}>
          <h3>Edit Poll</h3>
          <button className={styles.closeButton} onClick={() => {setEditModalVisible(false)}}>Close</button>
          <CreatePollForm edit
            onSubmit={editPoll}
            className={styles.form}
            title={pollData.title}
            description={pollData.description}
            duration={pollData.duration}
          />
        </div>
      </div>
      : '' }

      <main className={styles.main}>
        <h1>{pollData.title}</h1>

        { editCode ? <button onClick={() => {setEditModalVisible(true)}}>Edit</button> : '' }

        <p>{pollData.description}</p>
        <p>{ timerFinished ? 'This poll has ended.' : <>This poll ends <Moment fromNow date={end_date} onChange={checkTimerFinished} />.</> }</p>

        {!showResults ?
          <>
            <CastVoteForm
              onSubmit={castVote}
              className={styles.voteForm}
              voteOptions={Object.keys(data.results)}
            />
            <button className={styles.resultButton} onClick={() => {setShowResults(true);}}>Show Results</button>
          </>
        :
          <VoteResults
            className={styles.voteResults}
            classNameHighlight={styles.userVote}
            results={pollData.results}
            userVote={userVote}
          />
        }

      </main>
    </>
  )
}

export async function getServerSideProps({ res, params }: GetServerSidePropsContext<{ idt: string }>) {

  let errorCode: number = 500;
  let errorMsg: string = "";

  if (params) {
    const request = await fetch(`${process.env.API_BASEURL}/getPoll/${params.idt}`);
    const resp: GetPoll = await request.json();
    // console.log(resp);

    if (resp.Type === "success") {
      const data = resp.Data;

      return {
        props: { data, idt: params.idt },
      }
    } else {
      errorCode = resp.ErrorCode;
      errorMsg = resp.Error;
    }
  } else {
    errorCode = 404;
  }

  res.statusCode = errorCode;

  if (errorMsg) return {
    props: { errorCode, errorMsg },
  }

  return {
    props: { errorCode },
  }
}

export default Poll
