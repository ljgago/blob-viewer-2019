// Copyright © 2019 Leonardo Javier Gago <ljgago@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import * as Types from '../stores/types'

import {
  Button,
  Icon,
  ProgressBar,
} from '@blueprintjs/core'

const Root = styled.div `
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 15px 15px 15px 15px;
  padding: 20px;

  background-color: #394b59;

  svg {
    width: 26px;
    height: 26px;
  }

  .bp3-button {
    margin-left: 10px;
  }
`

const Description = styled.div `
  display: flex;
  align-items: center;
  margin: 0 10px 10px;
`
const Space = styled.div `
  margin-left: auto;
`

export const UploadItem = observer((props: Types.UploadItemComponent) => {
  const { 
    name,
    sizeFull,
    sizeUploaded,
    progressPercent,
    progressValue,
    progressSpeed,
    isProgress,
    onDelete,
  } = props

  return(
    <Root className="bp3-dark">
      <Description>
        <Icon
          iconSize={28}
          color="#a7b6c2"
          icon="cloud-upload"
        />
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{name}</div>
        <Space />
        <div>{progressSpeed}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{sizeUploaded} of {sizeFull}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{progressPercent}%</div>
        <Button
          intent="danger"
          minimal={true}
          icon="cross"
          onClick={onDelete}
        />
      </Description>
      <ProgressBar
        intent="success"
        animate={isProgress}
        value={progressValue}
      />
    </Root>
  )
})

export default UploadItem


/*
 
        { isProgress?  
          <Button
            intent="danger"
            minimal={true}
            icon="cross"
            onClick={onStop}
          /> :
          <Button
            intent="danger"
            minimal={true}
            icon="repeat"
            onClick={onRestart}
          />
        }
 */
