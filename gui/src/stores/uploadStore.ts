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
import { action, observable } from 'mobx'
import * as Types from './types'
import * as utils from '../utils'
import api from '../api'
import { RootStore } from './rootStore'
import * as azblob from '@azure/storage-blob'

export class UploadStore {
  root: RootStore
  constructor(root: RootStore) {
    this.root = root
  }

  @observable tags: React.ReactNode[] = []
  // @observable files: Types.BFiles[] = []
  @observable list: any = []
  /*
  @observable dataUpload: {
    files: Types.BFiles[],
    items: Types.UploadItemComponent[]
  } = {
    files: [],
    items: [],
  }*/

  @observable dataUpload: Types.UploadItemComponent[] = []
  
  count: number = 0
  queue: Types.BFiles[] = []
  hasUploadFile: boolean = false

  @action upadateQueue = () => {
    this.queue = this.dataUpload.reduce((items: any, item) =>{
      if(item.isQueue) {
        items.push(item)
      }
      return items
    }, [])
  }

  @action setFiles = async (files: any) => {
    if(this.root.viewer.dataPath.length < 2) {
      console.log("Error, please select a container")
      return
    }
    files.forEach((file: Types.BFiles) => {
      const rootPath = this.root.viewer.dataPath.map(item => item.text).slice(2).join("/")
      const fullPath = utils.urlJoin(rootPath, file.path)
      const container = this.root.viewer.currentContainer
      file.fullPath = fullPath
      file.container = container
      console.log("FullPath: " + fullPath)

      const item = {
        key: this.count,
        name: file.name,
        size: file.size,
        sizeFull: utils.formatBytes(file.size),
        sizeUploaded: "0 Bytes",
        progressSpeed: "",
        progressPercent: "0",
        progressValue: 0,
        isProgress: true,
        isQueue: true,
        aborter: azblob.Aborter.none,
        onStop: this.onStop(container, fullPath),
        onRestart: this.onRestart(container, fullPath),
        onDelete: this.onDelete(container, fullPath),
        file: file,
      }
      this.count++
      this.dataUpload.push(item)
      this.queue.push(file)
      this.uploadFiles()
    })
  }

  @action uploadFiles = async () => {
    if(this.hasUploadFile) {
      return
    }
    while(this.queue.length) {
      this.hasUploadFile = true
      const cookie  = api.auth.getCookie()
      if(cookie === {uri: "", token: ""}) {
        console.log("Cookie is empty")
        return
      }
      const file = this.queue[0]
      const containerName = file.container!
      const blobName = file.fullPath

      const serviceURL = api.azure.getServiceURL(cookie.uri, cookie.token)
      const containerURL = azblob.ContainerURL.fromServiceURL(serviceURL, containerName)
      const blobURL = azblob.BlobURL.fromContainerURL(containerURL, blobName)
      const blockBlobURL = azblob.BlockBlobURL.fromBlobURL(blobURL)
      
      let index = this.dataUpload.findIndex(item => item.file.container === file.container && item.file.fullPath === file.fullPath)
      if(index === undefined) {
        console.log("Index undefined")
        return
      }
      // Al agregar otro item, el index no cambia y apunteo al otro elemento por error
      try {
        let bytesSendBefore: number = 0
        await azblob.uploadBrowserDataToBlockBlob(this.dataUpload[index].aborter, file, blockBlobURL, {
          blockSize: utils.getBlockSize(file.size), // get the block size 256kB, 1MB, 4MB, 16MB, 64MB, 100MB
          parallelism: 20, // 20 concurrency
          progress: progress => {
            index = this.dataUpload.findIndex(item => item.file.container === file.container && item.file.fullPath === file.fullPath)
            this.dataUpload[index].progressSpeed = utils.formatBytesSpeed(progress.loadedBytes - bytesSendBefore)
            this.dataUpload[index].sizeUploaded = utils.formatBytes(progress.loadedBytes)
            this.dataUpload[index].progressValue = utils.progressCalc(this.dataUpload[index].size, progress.loadedBytes)
            this.dataUpload[index].progressPercent = utils.progressCalcPsercenterStr(this.dataUpload[index].size, progress.loadedBytes)
            bytesSendBefore = progress.loadedBytes
            console.log(this.dataUpload[index].progressPercent)
          }
        })
      } catch {
        console.log("Aborted")
        index = this.dataUpload.findIndex(item => item.file.container === file.container && item.file.fullPath === file.fullPath)
        this.dataUpload[index].isProgress = false
        this.queue.shift()
        continue
      }
      index = this.dataUpload.findIndex(item => item.file.container === file.container && item.file.fullPath === file.fullPath)
      if(this.dataUpload[index].size === 0) {
        this.dataUpload[index].progressValue = 1
        this.dataUpload[index].progressPercent = "100"
      }
      this.dataUpload[index].isProgress = false
      this.root.viewer.getData()
      this.queue.shift()
    }
    this.hasUploadFile = false
  }

  @action onDelete = (container: string, fullPath: string) => () => {
    const index = this.dataUpload.findIndex(item => item.file.container === container && item.file.fullPath === fullPath)
    this.dataUpload[index].aborter.abort()
    this.dataUpload = this.dataUpload.filter((_item, i) => index !== i)
  }

  @action onStop = (container: string, fullPath: string) => () => {
    const index = this.dataUpload.findIndex(item => item.file.container === container && item.file.fullPath === fullPath)
    this.dataUpload[index].aborter.abort()
  }

  @action onRestart = (container: string, fullPath: string) => () => {

  }
}

export default UploadStore
