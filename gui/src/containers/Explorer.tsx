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
import styled from 'styled-components'

import { rootContext } from '../stores/rootStore'

import VerticalBar    from '../components/VerticalBar'
import HorizontalBar  from '../components/HorizontalBar'
import SwitchView     from './SwitchView'

const Root = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

`
const Container = styled.div `
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Explorer = () => {
  const store = useContext(rootContext)

  useEffect(() => {
    console.log("getData")
    store.viewer.getData()
    return () => {
      console.log("resetData")
      store.viewer.resetData()
    }
  })

  return (
    <Root>
      <VerticalBar />
      <Container>
        <HorizontalBar />
        <SwitchView />
      </Container>
    </Root>
  )
}

export default Explorer
