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
import { action, computed, observable } from 'mobx'
import * as Types from './types'
import * as utils from '../utils'
import api from '../api'
import { RootStore } from './rootStore'
import * as azblob from '@azure/storage-blob'

import {
  IconName,
  Intent,
  IToastProps,
  MaybeElement,
  IBreadcrumbProps,
} from "@blueprintjs/core"

export class ViewerStore {
  root: RootStore
  constructor(root: RootStore) {
    this.root = root
  }

  //
  // UI store
  //

  // Global observable data
  @observable dataPath: IBreadcrumbProps[] = []
  @observable dataContainer: Types.Blob[] = []
  @observable dataFolder: Types.Blob[] = []
  @observable dataFile: Types.Blob[] = []

  // Global path status
  @observable currentContainer = ""
  @observable currentPath = ""
  @observable currentIndex = 0

  @observable iconSort: {
    name: IconName | MaybeElement,
    size: IconName | MaybeElement,
    modified: IconName | MaybeElement,
  } = {
    name: false,
    size: false,
    modified: false,
  }

  sessionMessageContent: IToastProps = {
    icon: "warning-sign",
    intent: Intent.DANGER,
    message: "The session has expired.",
  }

  isOpening: boolean = false

    /* 
    @observable cookie: { uri: string, token:string } = {
    uri: "https://svcdemo.blob.core.windows.net/",
    token: "sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-10-13T01:17:19Z&st=2019-09-06T17:17:19Z&spr=https&sig=3wWQ6igQJF957V0Rbx4n2pT5SnUyFv0zNoxz0lPfxnM%3D",
  }
     */

  @computed get showContainers() {
    return this.dataContainer
  }

  @computed get showFolders() {
    return this.dataFolder
  }

  @computed get showFiles() {
    return this.dataFile
  }

  @computed get showPath() {
    return [...this.dataPath]
  }

  @computed get getPath() {
    console.log(this.currentIndex)
    return this.dataPath
  }


  // Function for get data
  getContainers = async () => {
    const cookie  = api.auth.getCookie()
    if(cookie === {uri: "", token: ""}) {
      console.log("Cookie is empty")
      return
    }
    const serviceURL = api.azure.getServiceURL(cookie.uri, cookie.token)
    const listContainers = await api.azure.getContainers(serviceURL)
    if(listContainers === undefined) {
      this.root.auth.logout()
      this.root.auth.showAuthMessage(this.sessionMessageContent)
      // evento para terminar session
      return
    }
    this.refreshContainers(listContainers)
  }

  getBlobs = async () => {
    const cookie  = api.auth.getCookie()
    const serviceURL = api.azure.getServiceURL(cookie.uri, cookie.token)
    const listBlobs = await api.azure.getBlobs(serviceURL, this.currentContainer)
    if(listBlobs === undefined) {
      this.root.auth.logout()
      this.root.auth.showAuthMessage(this.sessionMessageContent)
      //this.showSessionMessage(this.sessionMessageContent)
      // evento para terminar session
      return
    }
    this.refreshBlobs(listBlobs)
  }

  // Show the containers
  @action refreshContainers = (list: azblob.Models.ContainerItem[]) => {
    const containers = list.reduce((containers: Types.Blob[], container, i) => {
      const data: Types.Blob = {
        key: i,
        icon: "inbox",
        name: container.name,
        isFolder: true,
        onClick: this.openContainer(container.name),
      }
      containers.push(data)
      return containers
    }, [])

    this.dataContainer = containers
    this.dataFolder = []
    this.dataFile = []
  }

  // Show the folders and blobs
  @action refreshBlobs = (list: azblob.Models.BlobItem[]) => {
    const cookie  = api.auth.getCookie()
    const index = this.currentIndex - 1
    const path = this.currentPath
    let name = ""
    // Filter all blob with the same path
    const data = list.filter((blob) => {
      const array = blob.name.split("/")
      if(index === 0) {
        if(array[index] === undefined) {
          return false
        }
        if(name === array[index]) {
          return false
        }
        name = array[index]
        return true
      }
      if(index > 0) {
        if(array[index] === undefined || array[index - 1] !== path) {
          return false
        }
        if(name === array[index]) {
          return false
        }
        name = array[index]
        return true
      }
      return false
    })
    // Filter all blob with path <= to index
    const folderRaw = data.filter((blob, i) => {
      const array = blob.name.split("/")
      if(array.length > (index + 1)) {
        return true
      }
      return false
    })
    const fileRaw = data.filter((blob) => {
      const array = blob.name.split("/")
      if(array.length === (index + 1)) {
        return true
      }
      return false
    })

    const folder = folderRaw.reduce((accum: any, blob, i) => {
      const array = blob.name.split("/")
      const item: Types.Blob = {
        key: i,
        icon: "folder-close",
        name: array[index],
        isFolder: true,
        onClick: this.openFolder(array[index]),
      }
      accum.push(item)
      return accum
    }, [])

    const file = fileRaw.reduce((accum: any, blob, i) => {
      const array = blob.name.split("/")
      const item: Types.Blob = {
        key: i,
        icon: "document",
        name: array[index],
        size: utils.formatBytes(blob.properties.contentLength!),
        sizeRaw: blob.properties.contentLength,
        modified: utils.formatDate(blob.properties.creationTime!),
        modifiedRaw: blob.properties.creationTime,
        isFolder: false,
        // Specifying &rscd=blob; attachment on the shared access signature overweite the content disposition header
        link: `${cookie.uri}${this.currentContainer}/${blob.name}?${cookie.token}&rscd=blob;%20attachment`,
        onDelete: this.onDelete(this.currentContainer, blob.name),
      }
      accum.push(item)
      return accum
    }, [])

    this.dataContainer = []
    this.dataFolder = folder
    this.dataFile = file
  }

  @action getData = async () => {
    if(this.currentContainer === "") {
      await this.getContainers()
    } else {
      await this.getBlobs()
    }
  }

  @action addPathElement = (currentPath: string) => {
    this.dataPath.push({
      //href: "#" + this.currentIndex.toString(),
      onClick: this.actionPath(currentPath, this.currentIndex),
      text: currentPath,
    })
  }

  @action deletePathElement = async (pathName: string, index: number) => {
    if(index === 0) {
      this.dataPath.splice(1, this.currentIndex + 1)
      this.currentContainer = ""
      this.currentPath = ""
      this.currentIndex = 0
    }
    if(index > 0) {
      if(this.currentIndex !== index) {
        const removeItems = this.currentIndex - index
        this.dataPath.splice(index + 1, removeItems)
      }
      this.currentPath = pathName
      this.currentIndex = index
    }
    await this.getData()
  }

  @action openContainer = (name: string) => async (event: MouseEvent<HTMLElement>) => {
    if(!this.isOpening) {
      this.isOpening = true
      this.currentContainer = name
      this.currentPath = ""
      this.currentIndex++
      this.addPathElement(this.currentContainer)
      await this.getData()
      this.isOpening = false
    }
  }

  @action openFolder = (name: string) => async (event: MouseEvent<HTMLElement>) => {
    //this.currentContainer = this.currentContainer
    if(!this.isOpening) {
      this.isOpening = true
      this.currentPath = name
      this.currentIndex++
      this.addPathElement(event.currentTarget.getAttribute("data-path")!)
      await this.getData()
      this.isOpening = false
    }
  }

  @action actionUpPath = async () => {
    if(!this.isOpening) {
      this.isOpening = true
      if(this.currentIndex > 0) {
        const path = this.dataPath.slice(-2)
        await this.deletePathElement(path[0].text as string, this.currentIndex-1)
      }
      this.isOpening = false
    }
  }

  @action actionPath = (pathName: string, index: number) => async () => {
    return await this.deletePathElement(pathName, index)
  }

  @action resetData = () => {
    this.dataContainer = []
    this.dataFolder = []
    this.dataFile = []
    this.dataPath =[ { onClick: this.actionPath("Container", 0), text: "Container" } ]
    this.currentContainer = ""
    this.currentPath = ""
    this.currentIndex = 0
  }

  // Sort functions
  @action sortByName = () => {
    let container: Types.Blob[] = []
    let folder: Types.Blob[] = []
    let file: Types.Blob[] = []
    switch(this.iconSort.name) {
      case "chevron-up":
        container = this.dataContainer.slice().sort((a, b) => { return utils.zToASort(a, b) })
        folder = this.dataFolder.slice().sort((a, b) => { return utils.zToASort(a, b) })
        file = this.dataFile.slice().sort((a, b) => { return utils.zToASort(a, b) })
        this.iconSort = { name: "chevron-down", size: false, modified: false }
        break
      case "chevron-down":
        container = this.dataContainer.slice().sort((a, b) => { return utils.aToZSort(a, b) })
        folder = this.dataFolder.slice().sort((a, b) => { return utils.aToZSort(a, b) })
        file = this.dataFile.slice().sort((a, b) => { return utils.aToZSort(a, b) })
        this.iconSort = { name: "chevron-up", size: false, modified: false }
        break
      case false:
        container = this.dataContainer.slice().sort((a, b) => { return utils.zToASort(a, b) })
        folder = this.dataFolder.slice().sort((a, b) => { return utils.zToASort(a, b) })
        file = this.dataFile.slice().sort((a, b) => { return utils.zToASort(a, b) })
        this.iconSort = { name: "chevron-down", size: false, modified: false }
        break
    }
    this.dataContainer = container
    this.dataFolder = folder
    this.dataFile = file
  }

  @action sortBySize = () => {
    let file: Types.Blob[] = []
    switch(this.iconSort.size) {
      case "chevron-up":
        file = this.dataFile.slice().sort((a, b) => { return utils.minToMaxSort(a, b) })
        this.iconSort = { name: false, size: "chevron-down", modified: false }
        break
      case "chevron-down":
        file = this.dataFile.slice().sort((a, b) => { return utils.maxToMinSort(a, b) })
        this.iconSort = { name: false, size: "chevron-up", modified: false }
        break
      case false:
        file = this.dataFile.slice().sort((a, b) => { return utils.minToMaxSort(a, b) })
        this.iconSort = { name: false, size: "chevron-down", modified: false }
        break
    }
    this.dataFile = file
  }

  @action sortByModified = () => {
    let file: Types.Blob[] = []
    switch(this.iconSort.modified) {
      case "chevron-up":
        file = this.dataFile.slice().sort((a, b) => { return utils.newToOldSort(a, b) })
        this.iconSort = { name: false, size: false, modified: "chevron-down" }
        break
      case "chevron-down":
        file = this.dataFile.slice().sort((a, b) => { return utils.oldToNewSort(a, b) })
        this.iconSort = { name: false, size: false, modified: "chevron-up" }
        break
      case false:
        file = this.dataFile.slice().sort((a, b) => { return utils.newToOldSort(a, b) })
        this.iconSort = { name: false, size: false, modified: "chevron-down" }
        break
    }
    this.dataFile = file
  }

  @action onDelete = (containerName: string, blobName: string) => async () => {
    const cookie  = api.auth.getCookie()
    const serviceURL = api.azure.getServiceURL(cookie.uri, cookie.token)
    await api.azure.deleteBlob(serviceURL, containerName, blobName)
    this.getData()
  }

  @action createContainer = async (containerName: string) => {
    console.log("Entro")
    const cookie  = api.auth.getCookie()
    const serviceURL = api.azure.getServiceURL(cookie.uri, cookie.token)
    await api.azure.createContainer(serviceURL, containerName)
  }

}

export default ViewerStore
