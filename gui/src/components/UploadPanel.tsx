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
  ITagProps,
  TagInput,
} from '@blueprintjs/core'

import Dropzone from './Dropzone'


declare module 'react' {
  //interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  interface InputHTMLAttributes<T> extends DOMAttributes<T> {
    webkitdirectory?: boolean;
    mozdirectory?: boolean;
    directory?: boolean;
  }
}

const Root = styled.div `
  display: flex;
  flex-direction: row;
  margin: 20px;



`


export const UploadPanel = observer(() => {
  const store = useContext(rootContext)

  const TagProps: ITagProps = {
    large: false,
    minimal: true,
    intent: "danger",
  }

  return(
    <Root className="bp3-dark" >
      <Dropzone />
      <TagInput
        tagProps={TagProps}
        values={store.upload.tags}
      />
    </Root>
  )
})

export default UploadPanel


