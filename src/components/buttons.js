import React, { useState } from 'react';

import styled from 'styled-components';
import { HiChevronLeft, HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';

import { useGetResultIndicator } from '../result';

const BackButtonStyle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  & > button {
    border: 0px solid black;
    background-color: transparent;
  }
`
export const BackButton = (props) => (
  <BackButtonStyle>
    <button {...props}><HiChevronLeft color="#8f8f8f" size={20}/></button>
  </BackButtonStyle>
);

export const ReorderButton = (props) => (
  <button className="btn btn-secondary" {...props}>
    <HiMenuAlt1 size={15}/>
    <HiMenuAlt3 size={15}/>
  </button>
)

export const EditButton = (props) => (
  <button className="btn btn-secondary" title="Edit" {...props}>
    Edit
  </button>
);
const CreateButtonStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
`
export const CreateButton = (props) => (
  <CreateButtonStyle className="btn btn-secondary" title="Create New" {...props}>
    <MdAdd size={19} color="white"/>
  </CreateButtonStyle>
);

export const DeleteButton = ({useMakeSubmitFn, onSuccess, ...props}) => {
  const [confirm, setConfirm] = useState(false);
  const { setSubmitting, options, render } = useGetResultIndicator({
    successStatus: 202, onSuccess,
  });
  const submitFn = useMakeSubmitFn(options)
  const confirmOnClick = () => {
    if(confirm) {
      setConfirm(false);
      setSubmitting(true);
      submitFn();
    } else {
      setConfirm(true);
    }
  }
  return (
    <>
      <button
        className="btn btn-primary"
        style={{backgroundColor: "red"}}
        onClick={confirmOnClick}
      >
        { confirm ? "Are you sure?" : "Delete"}
      </button>
      {render()}
    </>
  );
}
