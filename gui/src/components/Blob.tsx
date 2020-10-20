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

import React from 'react'
import { observer } from 'mobx-react-lite'
import * as Types from '../stores/types'

import {
  Button,
  Icon,
  Position,
  Classes,
  Tooltip,
} from "@blueprintjs/core"

//color="#5c7080"
export const Blob = observer((props: Types.Blob) => {
  const { name, size, link, icon, modified, isFolder, onClick, onDelete } = props

  return (
    <div className="table-row items bp3-dark" onClick={onClick} data-path={name}>
      <div className="text name">
        <Icon
          icon={icon}
          iconSize={20}
          color="#a7b6c2"
          style={{verticalAlign: "-4px"}}
        />&nbsp;&nbsp;&nbsp;&nbsp;{name}
      </div>
      <div className="text size">
        {size}
      </div>
      <div className="text modified">
        {modified}
      </div>
      {isFolder ?
        <div className="text action item-action"/> :
        <div className="text action item-action">
          <Tooltip
            position={Position.TOP}
            intent="primary"
            content="Download"
          >
            <a href={link} download={name}>
              <Button 
                className={Classes.MINIMAL}
                intent="primary"
                icon="download"
              />
            </a>
          </Tooltip>
          <Tooltip
            position={Position.TOP}
            intent="danger"
            content="Remove"
          >
            <Button
              className={Classes.MINIMAL}
              icon="trash"
              intent="danger"
              onClick={onDelete}
            />
          </Tooltip>
        </div>
      }
    </div>
  )
})

  /*
          <Popover content={blobMenu} position={Position.TOP}>
            <Button className={Classes.MINIMAL} icon="cog" />
          </Popover>
   */
export default Blob

  /*
    <tbody>
      <tr>
        <td>
          <Icon
            icon={props.blob.item.icon}
            color="#5c7080"
            iconSize={20}
            style={{verticalAlign: "-2px"}}
          />&nbsp;&nbsp;&nbsp;&nbsp;{props.blob.item.name}
        </td>
        <td>{props.blob.item.modified}</td>
        <td>
          <Popover content={props.blob.enu} position={Position.TOP}>
            <Button className={Classes.MINIMAL} icon="cog" />
          </Popover>
        </td>
      </tr>
      </tbody>
   */
