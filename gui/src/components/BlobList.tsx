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
import Blob from './Blob'
import { rootContext } from '../stores/rootStore'
import {
  Icon,
} from "@blueprintjs/core"

const Root = styled.div `
  margin: 5px 15px 15px 15px;
  border-radius: 5px;
  background-color: #394b59;
  //background-color: #e2e8ed;

  .table-row {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-wrap: wrap;
    padding-left: 15px;
    padding-right: 15px;
    vertical-align: middle;
    align-items: center;
    color: white;
    height: 44px;
  }

  .text {
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 40px;
  }

  .header {
    padding: 20px;
    font-weight: bold;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .items {
    // border-top: 2px solid #d6dfe5;
    border-top: 2px solid #30404c;
    border-collapse: collapse;
  }

  .items:hover {
    //background-color: #d6dfe5;
    //color: #106ba3;
    //border-radius: 5px;
    background-color: #30404c;
    color: #48aff0;
    cursor: pointer;
  }

  .items:hover:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .name {
    width: 40%;
    text-align: left;
    padding-left: 5px;
  }

  .header-name {
    padding-left: 34px;
  }

  .size {
    width: 10%;
    text-align: left;
  }

  .modified {
    width: 10%;
    text-align: left;
  }

  .action {
    text-align: right;
  }

  .item-action {
    //padding-right: 14px;
  }
}
`

export const BlobList = observer(() => {
  const store = useContext(rootContext)

  return (
    <Root>
      <div className="table-row header" >
        <div className="text name header-name">
          <div onClick={store.viewer.sortByName}
            onMouseEnter={() => { document.body.style.cursor = "pointer" }}
            onMouseLeave={() => { document.body.style.cursor = "default" }}
          >
            NAME
            &nbsp;<Icon icon={store.viewer.iconSort.name} />
          </div>
        </div>
        <div className="text size">
          <div
            onClick={store.viewer.sortBySize}
            onMouseEnter={() => { document.body.style.cursor = "pointer" }}
            onMouseLeave={() => { document.body.style.cursor = "default" }}
          >
            SIZE
            &nbsp;<Icon icon={store.viewer.iconSort.size} />
          </div>
        </div>
        <div className="text modified">
          <div 
            onClick={store.viewer.sortByModified}
            onMouseEnter={() => { document.body.style.cursor = "pointer" }}
            onMouseLeave={() => { document.body.style.cursor = "default" }}
          >
            MODIFIED
            &nbsp;<Icon icon={store.viewer.iconSort.modified} />
          </div>
        </div>
        <div className="text action">ACTION</div>
      </div>
      { store.viewer.showContainers.map(props => <Blob key={props.key} {...props} /> ) }
      { store.viewer.showFolders.map(props => <Blob key={props.key} {...props} /> ) }
      { store.viewer.showFiles.map(props => <Blob key={props.key} {...props} /> ) }
    </Root>
  )
})

export default BlobList


/*
    <ListStyle>
      <HTMLTable>
        <thead>
          <tr>
            <td>NAME</td>
            <td>SIZE</td>
            <td>LAST UPDATED</td>
            <td>ACTIONS</td>
          </tr>
        </thead>
        {store.viewer.listBlobs.items.map((e: any) => <BlobItem key={e.id} item={e} /> )}
      </HTMLTable>
    </ListStyle>
*/
