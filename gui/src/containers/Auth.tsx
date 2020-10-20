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
import {ReactComponent as Logo} from '../assets/azure-1.svg'
import {
  FormGroup,
  Button,
  Classes,
  InputGroup,
  Position,
  Toaster,
} from '@blueprintjs/core'

const Root = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c3a45;
  height: 100vh;

  .bp3-dark {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 100px;
  }

  .logo {
    align-items: center;
  }

  .container {
    border-radius: 5px
    background-color: #394b59;
    margin: 10px;
    padding: 20px 20px 2px 20px;
  }

  .bp3-input-group {
    margin-bottom: 15px;
  }

  .bp3-button {
    width: 100%;
  }
`

export const Auth = observer(() => {
  const store = useContext(rootContext)

  return (
    <Root>
      <div className="bp3-dark">
        <Logo className="logo" width={200} height={200} />
        <div className="container">
          <FormGroup
            helperText=""
            label=""
            labelFor="text-input"
            labelInfo="Auth Form"
          >
            <InputGroup className={Classes.MINIMAL}
              leftIcon="person"
              placeholder="Account Name"
              type={"text"}
              large={true}
              value={store.auth.account.name}
              onChange={store.auth.eventAccountName}
              onKeyPress={store.auth.eventOnKeyPress}
            />
            <InputGroup className={Classes.MINIMAL}
              leftIcon="lock"
              placeholder="Account Key"
              type={"password"}
              large={true}
              value={store.auth.account.key}
              onChange={store.auth.eventAccountKey}
              onKeyPress={store.auth.eventOnKeyPress}
            />
            <Button className={Classes.MINIMAL}
              large={true}
              text="Login"
              intent="success"
              icon="log-in"
              type="submit"
              onClick={store.auth.authenticate}
            />
          </FormGroup>
          <Toaster
            canEscapeKeyClear={true}
            position={Position.TOP}
            ref={store.auth.refHandlers.toaster}
          />
        </div>
      </div>
    </Root>
  )
})

export default Auth
