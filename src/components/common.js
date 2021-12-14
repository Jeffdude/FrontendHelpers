import React from 'react';

import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { getConfig } from '../config';

const { logoSvg, logoAltText } = getConfig()


export const PageCard = styled.div`
  background-color: white;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  margin: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  box-shadow: 0 12px 25px 0 rgba(0, 0, 0, 0.5), 0 18px 35px 0 rgba(0, 0, 0, 0.29);
  & > * {
    padding: 10px;
  }
`

export const OptionalCard = ({pageCard, children, style = {}}) => (
  pageCard ? <PageCard style={style}>{children}</PageCard> : <>{children}</>
)


export const DisableCover = styled.div`
  background-color: rgba(52, 52, 52, 0.8);
  border-radius: 10px;
  height: 100.1%;
  width: 100.1%;
  align-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  position: absolute;
  zIndex: 5;
`

export function TitleCard({title, data = {}, children}) {
  return (
    <PageCard>
      {title && <Helmet><title>{title}</title></Helmet>}
      <img
        src={logoSvg}
        alt={logoAltText}
        style={{width: "400px"}}
      />
      <div className="begoodpeople">
        {title ? title : "Be Good People."}
      </div>
      { children }
    </PageCard>
  )
}

export const CreateForm = styled.div`
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    & > div {
      white-space: nowrap;
    }
    & > button {
      align-self: center;
    }
    & > * {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      & > * {
        margin-right: 10px;
      }
    }
  }
`
