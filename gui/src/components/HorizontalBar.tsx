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
  NavbarHeading,
  Tooltip,
  Position,
} from '@blueprintjs/core'

const Root = styled.div<any> `
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 50px;
  background-color: #394b59;

  .bp3-navbar-heading {
    //margin-top: 2px;
    margin-left: 20px;
    font-weight: 500;
    font-size: 28px;
    color: ${ (props: any) => props.view };
  }

  .bp3-navbar {
    display: flex;
    flex-direction: row;
    box-shadow: inset 0 0 0 0;
  }

  .bp3-navbar.bp3-dark {
    box-shadow: inset 0 0 0 0;
  }
 
  .form {
    margin-left: auto;  
  }

  .bp3-button {
    margin-right: 20px;
  }

`

const Space = styled.div `
  margin-left: auto;
`

export const HorizontalBar = observer(() => {
  const store = useContext(rootContext)

  return (
    <Root view={store.explorer.showColorView} className="navbar bp3-dark">
      <NavbarHeading>
        {store.explorer.showView}
      </NavbarHeading>
      <Space />
      <Tooltip
        position={Position.LEFT}
        intent={store.explorer.showColorIntent}
        content="Logout"
      >
        <Button
          minimal={true}
          intent={store.explorer.showColorIntent}
          icon="log-out"
          onClick={store.auth.logout}
        />
      </Tooltip>
    </Root>
  )
})

export default HorizontalBar

/*
 *
    <Root view={store.explorer.showColorView} className="bp3-dark">
      <Navbar className="bp3-navbar bp3-dark">
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>{store.explorer.showView}</NavbarHeading>
        </NavbarGroup>
        <NavbarGroup className="form">
          <Tooltip
            position={Position.BOTTOM_LEFT}
            intent={store.explorer.showColorIntent}
            content="Logout"
          >
            <Button
              className={Classes.MINIMAL}
              intent={store.explorer.showColorIntent}
              icon="log-out"
              onClick={store.auth.logout}
            />
          </Tooltip>
        </NavbarGroup>
      </Navbar>
    </Root>
 *
 * */

