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

import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { rootContext } from '../stores/rootStore'

import Auth from './Auth'
import Explorer from './Explorer'

const Root = styled.div `
  width: 100%;
  height: 100%;
`

const App = observer(() => {
  const store = useContext(rootContext)

  // check if the cookie or token expired and connect
  useEffect(() => {
    store.viewer.resetData()
    store.auth.getCookie()
    if(store.auth.cookie.uri !== "" || store.auth.cookie.token !== "" ) {
      store.auth.setToLogout()
      console.log("Connected")
      return
    }
    console.log("Disconnected")
  })

  return (
    <Root>
      { store.auth.isConnected ?
        <Explorer />:
        <Auth />
      }
    </Root>
  )
})

export default App

/*

const Main = styled.div `
  display: flex;
  flex-direction: column;
`
const Section = styled.div `
  display: flex;
  flex-direction: column;
`
const Columns = styled.div `
  display: flex;
  flex-direction: row;
`
const Left = styled.div `
  min-height: calc(100vh - 50px);
  flex: 0 0 20em;
  background-color: #394b59;
`
const Right = styled.div `
  min-height: calc(100vh - 50px);
  height: auto;
  flex: 2;
  background-color: #2c3a45;
`

const App = () => {
  return (
    <Main>
      <Section>
        <AuthBar />
      </Section>
      <Columns>
        <Left>
          <TreeView />
        </Left>
        <Right>
          <PathView />
          <ListBlob />
        </Right>
      </Columns>
    </Main>
  )
}




const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,
  section: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  } as CSSProperties,
  columns: {
    display: "flex",
    flexDirection: "row",
  } as CSSProperties,
  left: {
    height: "calc(100vh - 50px)",
    flex: 1,
    backgroundColor: "#394b59",
  } as CSSProperties,
  right: {
    height: "calc(100vh - 50px)",
    flex: 2,
  } as CSSProperties,
}



      <div style={styles.wrapper}>
        <div style={styles.section}>
          <LoginBar />
        </div>
        <div style={styles.columns}>
          <div style={styles.left}>
            <TreeView />
          </div>
          <div style={styles.right}>
            <PathView />
          </div>
        </div>
      </div>



      <div className="app">
        <div className="app-header">
          <LoginBar />
        </div>
        <div className="app-body">
          <TreeView />
          <div className="app-body-2">
            <PathView />
            <ListBlob />
          </div>
        </div>
      </div>
*/

