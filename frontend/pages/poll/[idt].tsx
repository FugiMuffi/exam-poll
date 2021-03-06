import type { NextPage, GetServerSidePropsContext } from 'next'
import type { GetPoll, GetPollData } from 'types/getPoll'
import styles from 'styles/Poll.module.scss'
import Head from 'next/head'
import Error from 'next/error'
import Moment from 'react-moment'
import React, { useState, useEffect, useRef } from 'react'
import { use100vh } from 'react-div-100vh'
import { nanoid } from 'nanoid'
import ReactTooltip from 'react-tooltip';
import { FaPencilAlt } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import CreatePollForm from 'components/createPollForm'
import CastVoteForm from 'components/castVoteForm'
import VoteResults from 'components/voteResults'


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
        // hack until fingerprint check is removed on the server side
        fingerprint: nanoid(),
        grade: form.vote.value
      })
    });

    const res: GetPoll = await response.json();
    console.log(res);

    if (res.Type == "failure") {
      const timeOfError = new Date();
      if (confirm(res.Error + "\n\nSend report?")) {
        let body = "timestamp: " + timeOfError.getTime();
        body += "\npollData: " + JSON.stringify(pollData);
        body += "\nres: " + JSON.stringify(res);
        window.open("mailto:lucas@fugi.dev?subject=Bug%20Report&body=" + encodeURI(body));
      }
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

  const copyURL: React.MouseEventHandler<HTMLInputElement> = async (e) => {
    e.preventDefault();

    const input = e.target as typeof e.target & {
      value: string;
      select: Function;
    };

    input.select();

    navigator.clipboard.writeText(input.value).then(() => {
      const tmp = tipText;
      setTipText("Copied to clipboard!");
      if (shareRef.current) ReactTooltip.show(shareRef.current);
      setTimeout(() => {
        setTipText(tmp);
        const tooltip = document.getElementById('shareUrlTip');
        if (shareRef.current && tooltip && window.getComputedStyle(tooltip).getPropertyValue("visibility") == 'visible')
          ReactTooltip.show(shareRef.current);
      }, 2000);
    });
  }

  const [pollData, setPollData] = useState(data);
  const [timerFinished, setTimerFinished] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userVote, setUserVote] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [tipText, setTipText] = useState("Click to copy");
  const height = use100vh();
  const screenHeight = height ? `${height}px` : '100vh';
  const shareRef = useRef<HTMLInputElement>(null);

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

  const editModal = (
    <div id={styles.backdrop} style={{display: editModalVisible ? "flex" : "none"}} onClick={() => {setEditModalVisible(false)}}>
      <div id={styles.editModal} onClick={(e) => {e.stopPropagation();}}>
        <a className={styles.closeButton} onClick={() => {setEditModalVisible(false)}}>
          <IoMdClose/>
        </a>

        <div className={styles.wrapper}>
          <h3>Edit Poll</h3>

          <CreatePollForm edit
            onSubmit={editPoll}
            className={styles.form}
            title={pollData.title}
            description={pollData.description}
            duration={pollData.duration}
          />
        </div>
      </div>
    </div>
  )

  const end_date = new Date(data.end_time * 1000);
  checkTimerFinished();

  return (
    <>
      <Head>
        <title>{pollData.title}</title>
        <meta name="description" content={pollData.description} />
      </Head>

      <style jsx>{`
        main {
          --screen-height: ${screenHeight};
        }
      `}</style>

      { editCode ? editModal : '' }

      <main className={styles.main}>
        <h1>
          {pollData.title}
          { editCode ? <a className={styles.editButton} onClick={() => setEditModalVisible(true)}><FaPencilAlt/></a> : '' }
        </h1>

        { pollData.description.length > 0 ? <p>{pollData.description}</p> : '' }
        <p>{ timerFinished ? 'This poll has ended.' : <>This poll ends <Moment fromNow date={end_date} onChange={checkTimerFinished} />.</> }</p>

        { editCode && typeof window.location !== 'undefined' ? <>
        <div>
          Share this poll:
          <input
            type="text"
            className={styles.shareURL}
            ref={shareRef}
            readOnly
            onClick={copyURL}
            defaultValue={window.location.href.replace(location.hash,'')}
            data-tip
            data-for="shareUrlTip"
          />
          <ReactTooltip
            id="shareUrlTip"
            place="bottom"
            effect="solid"
            backgroundColor="#000"
            textColor="#fff"
          >
            {tipText}
          </ReactTooltip>
        </div>
        </> : '' }

        { !timerFinished && !showResults ?
          <>
            <CastVoteForm
              onSubmit={castVote}
              className={styles.voteForm}
              voteOptions={Object.keys(data.results)}
            />
            <button className={styles.resultButton} onClick={() => {setShowResults(true);}}>Show Results</button>
          </>
        :
          <VoteResults results={pollData.results} />
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
