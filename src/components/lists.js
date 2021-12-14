import React from 'react';

import styled from 'styled-components';

const InfoListStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  & > * {
    display: flex;
    flex-direction: row;
    & > .key {
      font-weight: bold;
      margin-right: 10px;
    }
  }
`

export const InfoListFromObject = ({data, ellipses=false, wide=false}) => {
  let components = [];
  for (const [key, value] of Object.entries(data)) {
    components.push((
      <div key={key}>
        <div className="key">
          { key }:
        </div>
        <div className="value" style={{overflowWrap: "break-word", maxWidth: wide ? 700 : 450}}>
          { ! value 
            ? "<unknown>"
            : typeof value === 'string'
            ? value
            : Array.isArray(value)
            ? "[" + value.map(v => JSON.stringify(v)).join(", ") + "]"
            : JSON.stringify(value) 
          }
        </div>
      </div>
    ))
  }
  return (
    <InfoListStyle>
      { components }
      { ellipses && <div style={{alignSelf: "center", lineHeight: "50%"}}>...</div>}
    </InfoListStyle>
  );
}
