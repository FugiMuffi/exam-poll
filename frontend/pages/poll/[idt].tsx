import type { NextPage, GetServerSidePropsContext } from 'next'
import type { GetPoll, GetPollData } from 'types/getPoll'
import styles from 'styles/Poll.module.scss'
import Head from 'next/head'
import Error from 'next/error'
import Moment from 'react-moment'
import { useState } from 'react'


type Props = { data: GetPollData } & { errorCode: number, errorMsg?: string }

const Poll: NextPage<Props> = ({ data, errorCode, errorMsg }) => {
  if (errorCode) return <Error statusCode={errorCode} title={errorMsg} />

  const end_date = new Date(data.end_time * 1000);

  const [timerFinished, setTimerFinished] = useState(false);

  const checkTimerFinished = () => {
    if (!timerFinished && end_date < new Date()) setTimerFinished(true);
  }

  checkTimerFinished();

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </Head>

      <main className={styles.main}>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>{ timerFinished ? 'This poll has ended.' : <>This poll ends <Moment fromNow date={end_date} onChange={checkTimerFinished} />.</> }</p>
      </main>
    </>
  )
}

export async function getServerSideProps({ res, params }: GetServerSidePropsContext<{ idt: string }>) {

  let errorCode: number = 500;
  let errorMsg: string = "";

  if (params) {
    const request = await fetch(`http://localhost:8000/getPoll/${params.idt}`);
    const resp: GetPoll = await request.json();
    console.log(resp);

    if (resp.Type === "success") {
      const data = resp.Data;

      return {
        props: { data },
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
