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

import React, { useState, useContext, ChangeEvent, CSSProperties } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import classNames from 'classnames'
import { rootContext } from '../stores/rootStore'
import { ReactComponent as NewInbox } from '../assets/inbox.svg'
import {
  Alert,
  Breadcrumbs,
  Classes,
  Divider,
  InputGroup,
  Button,
  FocusStyleManager,
  Position,
  Tooltip,
} from '@blueprintjs/core'

const Root = styled.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  //background-color: #e2e8ed;
  margin: 15px;
  padding: 5px 15px 5px;
  border-radius: 5px;
  background-color: #394b59;  

  .bp3-button.bp3-minimal.bp3-intent-primary {
    color: white;
  }

  .path {
    font-size: 20px;
    width: 100%;
  }

  .control {
  }

  .bp3-breadcrumbs-collapsed {
    margin-bottom: 3px;
  }

  .bp3-breadcrumbs-current {
    font-weight: bold;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    background-color: #e2e8ed;
    margin: 15px;
    padding: 5px 20px 5px;
    border-radius: 5px;
  }

  .bp3-divider {
    border-color: rgb(255, 255, 255);
  }

  .bp3-divider {
    margin: 0 20px 0 15px;
    border-right: 2px solid #5c7080;
    border-bottom: 22px solid #5c7080;
  }
  .container {
    margin-left: 6px;
  }

  .create-container {
    margin-right: 10px;
  }
`

const divStyle: CSSProperties = {
  textAlign: "center",
}


const styles = classNames("bp3-dark", Classes.MINIMAL, {textAlign: "center",})

/*
  .arrow svg:hover {
    fill: #48aff0;
  }
      <a>
        <Icon className="arrow" icon="double-chevron-up" color="white" />
      </a>
   */
export const NavPath = observer(() => {
  const store = useContext(rootContext)
  FocusStyleManager.onlyShowFocusOnTabs()
  const [ isOpen, setOpen ] = useState(false)
  const [ containerName, setContainerName ] = useState("")

  const handleCreateContainerOpen = () => setOpen( true )
  const handleCreateContainerCancel = () => setOpen( false )
  const handleCreateContainerConfirm = (name: string) => async () => {
    console.log("Container Name")
    await store.viewer.createContainer(name)
    setOpen( false )
  }
  const handleContainerName = (e: ChangeEvent<HTMLInputElement>) => {
    setContainerName(e.currentTarget.value)
  }

  return (
    <Root className={styles} >
      <Button
        intent="primary"
        minimal={true}
        icon="double-chevron-up"
        onClick={store.viewer.actionUpPath}
      />
      <Divider />
      <Breadcrumbs className="path"
        minVisibleItems={1}
        items={store.viewer.showPath}
      />
      <Divider />
      <Tooltip
        position={Position.TOP}
        intent="primary"
        content={"Create Container"}
      >
        <Button className="create-container"
          intent="primary"
          minimal={true}
          onClick={handleCreateContainerOpen}
        >
          <NewInbox className="new-inbox" width={18} height={18} fill="white" color='white' />
        </Button>
      </Tooltip>
      <Tooltip
        position={Position.TOP}
        intent="primary"
        content={"Refresh View"}
      >
        <Button
          intent="primary"
          minimal={true}
          icon="refresh"
          onClick={store.viewer.getData}
        />
      </Tooltip>
      <Alert className="bp3-dark"
        cancelButtonText="Cancel"
        confirmButtonText="Create Container"
        icon="inbox"
        intent="primary"
        isOpen={isOpen}
        onCancel={handleCreateContainerCancel}
        onConfirm={handleCreateContainerConfirm(containerName)}
      >
        <InputGroup className="input-container"
          placeholder="Container name"
          type={"text"}
          large={true}
          value={containerName}
          onChange={handleContainerName}
        />
        <br />
      </Alert>
    </Root>
  )
})

export default NavPath


