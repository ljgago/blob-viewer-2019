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

import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { rootContext } from '../stores/rootStore'
import {
  Button,
  Position,
  Tooltip,
} from '@blueprintjs/core'


const Root = styled.div `
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #394b59;

  .bp3-button {
    text-align: left;
  }

  .bp3-button.bp3-large {
    min-height: 50px;
    min-width: 50px;
  }

  svg {
    width: 20px;
    height: 20px;
  }

`

export const VerticalBar = observer(() => {
  const store = useContext(rootContext)

  return (
    <Root className="bp3-dark">
      <Button
        minimal={true}
        large={true}
      />
      <Tooltip
        position={Position.RIGHT}
        intent="primary"
        content="Viewer"
      >
        <Button
          intent="primary"
          minimal={true}
          large={true}
          icon="grid-view"
          onClick={store.explorer.setView("viewer")}
        />
      </Tooltip>
      <Tooltip
        position={Position.RIGHT}
        intent="success"
        content="Upload"
      >
        <Button
          intent="success"
          minimal={true}
          large={true}
          icon="upload"
          onClick={store.explorer.setView("upload")}
        />
      </Tooltip>
      <Tooltip
        position={Position.RIGHT}
        intent="danger"
        content="Setting"
      >
        <Button
          intent="danger"
          minimal={true}
          large={true}
          icon="settings"
          onClick={store.explorer.setView("setting")}
        />
      </Tooltip>
    </Root>
  )
})

export default VerticalBar

