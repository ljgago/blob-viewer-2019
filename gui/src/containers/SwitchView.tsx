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

import { useDropzone } from 'react-dropzone'

import Viewer from './Viewer'
import Upload from './Upload'
//import { Setting } from '../../setting/container/Setting'

const Root = styled.div `
  width: 100%;
  height: 100%;
  background-color: #2c3a45;

  .dropzone {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

`

export const SwitchView = observer(() => {
  const store = useContext(rootContext)

  const { getRootProps } = useDropzone({
    onDrop: files => store.upload.setFiles(files),
  })

  switch(store.explorer.view) {
  case "viewer":
    return (
      <Root>
        <div { ...getRootProps({ className: 'dropzone' }) } className="dropzone">
          <Viewer />
        </div>
      </Root>
    )
  case "upload":
    return (
      <Root>
        <Upload />
      </Root>
    )
  case "setting":
    return (
      <Root>
      </Root>
    )
  default:
    return (
      <Root>
        <Viewer />
      </Root>
    )
  }
})

export default SwitchView
