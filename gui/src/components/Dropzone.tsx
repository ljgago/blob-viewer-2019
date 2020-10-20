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

const Root2 = styled.div `
  display: flex;
  flex-direction: column;
  opacity: 1;
  min-width: 200px;
  min-height: 100px;
  margin-right: 20px;

  .dropzone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: #394b59;
    border-style: dashed;
    background-color: #232f37;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
  }

  input {
    display: none;
  }

`

const Root = styled.div `
  opacity: 0.5;

  .dropzone {
    min-height: 100%;
    border-color: #394b59;
    border-style: dashed;
  }
`

/*
export const Dropzone = observer(() => {
  const store = useContext(rootContext)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: files => store.upload.setFiles(files),
  })

  return (
    <Root className="bp3-dark" >
      <div { ...getRootProps({ className: 'dropzone' }) }>
        <input { ...getInputProps() } />
      </div>
    </Root>
  )
})
 * */

export const Dropzone = observer(() => {
  const store = useContext(rootContext)
  const { getRootProps } = useDropzone({
    onDrop: files => store.upload.setFiles(files),
  })

  return (
    <Root className="bp3-dark" >
      <div { ...getRootProps({ className: 'dropzone' }) } className="dropzone">
        hola
      </div>
    </Root>
  )
})

export default Dropzone
