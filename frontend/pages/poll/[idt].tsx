import type { NextPage, GetServerSidePropsContext } from 'next'
import Error from 'next/error'
import styles from 'styles/Poll.module.scss'
import { GetPoll, GetPollData } from 'types/getPoll'


type Props = { data: GetPollData } & { errorCode: number, errorMsg?: string }

const Poll: NextPage<Props> = ({ data, errorCode, errorMsg }) => {
  if (errorCode) return <Error statusCode={errorCode} title={errorMsg} />

  return (
    <div className={styles.container}>
      <p>{data.title}</p>
    </div>
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
