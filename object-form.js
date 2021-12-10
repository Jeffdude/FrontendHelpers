import React, { useEffect, useState } from 'react';

import {
  CreateForm, PageCard, DisableCover
} from '../components/common.js';
import { LoadingIcon } from '../components/loading.js';
import { ResultIndicator } from '../components/result.js';


export const TextComponent = (placeholder, moreProps = {}) => (props) => (
  <input type="text" name="name" className="form-control" 
    placeholder={placeholder} {...props} {...moreProps}/>
)

export function ObjectForm({
  useMakeSubmitFn, stateList, buttonText, preProcessData, formStyle={},
  clearStateOnSubmit=true, forwardFormState=false, children,
}){ 
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(undefined);
  const [errorText, setErrorText] = useState("")

  let initialState = {}
  stateList.forEach(item => initialState[item.key] = item.initialState)
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if(submissionResult === undefined) {
      return;
    }
    if(submissionResult && clearStateOnSubmit) {
      let initialState = {}
      stateList.forEach(item => initialState[item.key] = item.initialState)
      setState(initialState);
    }
    setTimeout(
      () => {
        setSubmissionResult(undefined);
        setErrorText("");
      },
      (submissionResult ? 1000 : 5000)
    )
  }, [
    stateList,
    setState,
    submissionResult,
    setSubmissionResult,
    clearStateOnSubmit
  ]);

  const submitFn = useMakeSubmitFn({onSettled: result => {
    setSubmitting(false);
    setSubmissionResult(result?.ok && result.status === 201);
  }});

  const isEmpty = item => {
    const itemState = state[item.key];
    if(Array.isArray(itemState)){
      return !itemState.length;
    }
    return !itemState;
  }

  const onSubmit = async e => {
    e.preventDefault();
    let submissionData = {};
    stateList.forEach(item => submissionData[item.key] = item.formatFn(state[item.key]));
    let errorFields = stateList.filter(item => (isEmpty(item) && !item?.optional));
    if(errorFields.length) {
      setErrorText("Missing fields: " + errorFields.map(i => i.label).join(", "));
      setSubmissionResult(false);
      return;
    }
    if(preProcessData){
      let [newData, errors] = preProcessData(JSON.parse(JSON.stringify(submissionData)));
      submissionData = newData;
      if(errors.length){
        setErrorText("Validation Errors: " + errors);
        setSubmissionResult(false);
        return;
      }
    }
    setSubmitting(true);
    return await submitFn(submissionData);
  }
  return (
    <PageCard style={{position: "relative"}}>
      <CreateForm style={formStyle}>
        <form onSubmit={onSubmit}>
          { stateList.map((item, index) => (
            <div key={item.key + "-" + index}>
              <label htmlFor={item.key + "-" + index}>{item.label}:</label>
              {item.component({
                state: [state[item.key], v => setState({...state, [item.key]: v})],
                value: state[item.key],
                id: item.key + "-" + index,
                onChange: e => setState({...state, [item.key]: e.target.value}),
                style: item.componentStyle ? item.componentStyle : {},
              })}
            </div>
          ))}
          <button className="btn btn-primary" type="submit">
            {buttonText}
          </button>
        </form>
      </CreateForm>
      {(submitting || (submissionResult !== undefined)) &&
        <DisableCover>
          {submitting && <LoadingIcon size={50} color="white"/>}
          {(submissionResult !== undefined) && 
            <ResultIndicator dark result={submissionResult} errorText={errorText}/>
          }
        </DisableCover>
      }
      {
        React.Children.map(children, child => {
          if (forwardFormState && React.isValidElement(child)) {
            return React.cloneElement(child, {formState: state})
          }
          return child;
        })
      }
    </PageCard>
  );
}
