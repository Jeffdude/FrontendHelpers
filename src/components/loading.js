import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { VscLoading } from 'react-icons/vsc';


export function LoadingText({justDots = false} = {}) {
  const [ count, setCount ] = useState(2);
  let text = (justDots ? "." : "loading") + ".".repeat(count);
  useEffect(() => {
    let timer = setTimeout(() => {
      if(count > 4) {
        setCount(2);
      } else {
        setCount(count + 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [count, setCount]);
  return (
    <div className="loading-text">
      {text}
    </div>
  )
}

const Spinner = styled.div`
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
`

export function LoadingIcon(props) {
  return <Spinner><VscLoading {...props}/></Spinner>
}
