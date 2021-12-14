import React, { useEffect, useState } from 'react';

import { HiCheckCircle, HiExclamation } from 'react-icons/hi';
import { LoadingIcon } from './components/loading';

export function ResultIndicator({result, dark = false, errorText = ""}) {
  return (
    <div className="result-indicator">
      {!!result 
        ? <div style={{color: dark ? "white" : "black"}}>
            <HiCheckCircle size={30} color={dark ? "lightgreen" : "green"}/>
            Success!
          </div>
        : <div className="error-text" style={{color: dark ? "lightred" : "red"}}>
            <HiExclamation size={30} color={"red"}/>
            Failed!<br/>{errorText}
          </div>
      }
    </div>
  )
}

export function useGetResultIndicator({successStatus = 201, onSuccess = () => {}} = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(undefined);
  const [errorText, setErrorText] = useState("")
  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    setTimeout(
      () => {
        let success = !!submissionResult;
        setSubmissionResult(undefined);
        setErrorText("");
        if(success) {
          onSuccess();
        }
      },
      (submissionResult ? 1000 : 5000)
    )
  }, [onSuccess, submissionResult, setSubmissionResult]);

  return {
    setSubmitting, 
    options: {onSettled: result => {
      setSubmitting(false);
      let success = result.ok && result.status === successStatus;
      if(!success) console.log("[!][ResultIndicator] Failed Result:", result);
      setSubmissionResult(success);
    }},
    render: () => (
      <>
        { submitting && <LoadingIcon size={30} color="black"/> }
        { submissionResult !== undefined && 
            <ResultIndicator result={submissionResult} errorText={errorText}/>
        }
      </>
    )
  }
}
