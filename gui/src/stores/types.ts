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

import { MouseEvent } from 'react'
import * as azblob from '@azure/storage-blob'
import {
  IconName,
  ITreeNode,
} from "@blueprintjs/core";
import {TransferProgressEvent} from '@azure/ms-rest-js';

export interface NodeTree {
  nodes: ITreeNode[]
}

export interface Blob {
  childNode?: Array<Blob>
  key: number
  icon: IconName
  name: string
  size?: string
  sizeRaw?: number
  modifiedRaw?: Date
  modified?: string
  link?: string
  path?: string
  isFolder: boolean
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onDelete?: (event: MouseEvent<HTMLElement>) => void
}

export interface ListBlob {
  items: Blob[]
}

export interface PathItem {
  key: number
  name: string
  index: number
  lastItem: boolean
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export interface TreeBlob {
  name: string
  kind: string
  data?: azblob.Models.BlobItem
  childNode?: TreeBlob[]
}


export interface KeyboardEvent {
    key: string
}

export interface UploadItemComponent {
  key: number
  name: string
  size: number
  sizeFull: string
  sizeUploaded: string
  progressSpeed: string
  progressPercent: string
  progressValue: number
  aborter: azblob.Aborter
  isProgress: boolean
  isQueue: boolean
  onProgress?: (progress: TransferProgressEvent) => void
  onStop: (event: MouseEvent<HTMLElement>) => void
  onRestart: (event: MouseEvent<HTMLElement>) => void
  onDelete: (event: MouseEvent<HTMLElement>) => void
  file: BFiles
}

export interface BFiles extends File {
  path?: string
  fullPath: string
  container?: string
}


export const NODE_TEST: ITreeNode[] = [
  {
    id: 1,
    icon: "folder-open",
    hasCaret: true,
    isExpanded: true,
    label: "Container 1",
    childNodes: [
      {
        id: 2,
        icon: "document",
        label: "File1.mkv",
        nodeData: {
          id: 2,
          icon: "document",
          name: "File1.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 3,
        icon: "document",
        label: "File2.mkv",
        nodeData: {
          id: 3,
          icon: "document",
          name: "File2.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 4,
        icon: "document",
        label: "File3.mkv",
        nodeData: {
          id: 4,
          icon: "document",
          name: "File3.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 5,
        icon: "document",
        label: "File4.mkv",
        nodeData: {
          id: 5,
          icon: "document",
          name: "File4.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      }
    ]
  },
  {
    id: 6,
    icon: "folder-open",
    hasCaret: true,
    isExpanded: true,
    label: "Container 2",
    childNodes: [
      {
        id: 7,
        icon: "document",
        label: "File1.mkv",
        nodeData: {
          id: 7,
          icon: "document",
          name: "File1.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 8,
        icon: "document",
        label: "File2.mkv",
        nodeData: {
          id: 8,
          icon: "document",
          name: "File1.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 9,
        icon: "document",
        label: "File3.mkv",
        nodeData: {
          id: 9,
          icon: "document",
          name: "File1.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      },
      {
        id: 10,
        icon: "document",
        label: "File4.mkv",
        nodeData: {
          id: 10,
          icon: "document",
          name: "File1.mkv", 
          modified: (new Date()).toString(),
          link: "http://personal.psu.edu/xqz5228/jpg.jpg"
        }
      }
    ]
  }
]



export const NODE_TEST_2: ITreeNode[] = [
{
  id: 20,
  icon: "folder-open",
  hasCaret: true,
  isExpanded: true,
  label: "ROOT",
  childNodes: [
    {
      id: 0,
      icon: "folder-open",
      hasCaret: true,
      isExpanded: true,
      label: "Seccond Level",
      childNodes: [
        {
          id: 1,
          icon: "folder-open",
          hasCaret: true,
          isExpanded: true,
          label: "Container 1",
          childNodes: [
            {
              id: 2,
              icon: "document",
              label: "File1.mkv"
            },
            {
              id: 3,
              icon: "document",
              label: "File2.mkv"
            },
            {
              id: 4,
              icon: "document",
              label: "File3.mkv"
            },
            {
              id: 5,
              icon: "document",
              label: "File4.mkv"
            }
          ]
        },
        {
          id: 6,
          icon: "folder-open",
          hasCaret: true,
          isExpanded: true,
          label: "Container 1",
          childNodes: [
            {
              id: 7,
              icon: "document",
              label: "File1.mkv"
            },
            {
              id: 8,
              icon: "document",
              label: "File2.mkv"
            },
            {
              id: 9,
              icon: "document",
              label: "File3.mkv"
            },
            {
              id: 10,
              icon: "document",
              label: "File4.mkv"
            }
          ]
        }
      ]
    }
  ]}
]
