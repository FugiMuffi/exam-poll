import type { FunctionComponent } from "react";
import ResultChart from "components/resultsChart";

type Props = {
  results: {
    [option: string]: number;
  };
};

const VoteResults: FunctionComponent<Props> = ({ results }) => {
  return <ResultChart results={results} />;
};

export default VoteResults;
