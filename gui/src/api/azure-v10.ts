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

import * as azblob from '@azure/storage-blob'
  /*

export class StorageBlob {
  uri: string
  token: string

  GetCookie = () => {
    const cookie = new Cookie()
    this.uri = cookie.get("uri")
    this.token = cookie.get("token")
  }

  private getServiceURL = (): ServiceURL => {
    const pipeline = StorageURL.newPipeline(
      new AnonymousCredential(), {
        retryOptions: { maxTries: 4 }
      }
    )

    const serviceURL = new ServiceURL(
      `${this.uri}?${this.token}`,
      pipeline
    )
    console.log(this.uri)
    console.log(this.token)
    return serviceURL
  }

  TokenCheck = async () => {
    const serviceURL = this.getServiceURL()
    try {
      const info = await serviceURL.getAccountInfo(Aborter.timeout(5000))
      const currentTime = new Date().getTime()
      const tokenTime = info.date!.getTime()
      if (tokenTime >= currentTime) {
          return true
      }
    } catch {
      return false
    }
    return false
  }

  GetNodeTree = async () => {
    const serviceURL = this.getServiceURL()
    let i = 1
    let node: ITreeNode[] = []
    let marker
    let listContainer: Models.ServiceListContainersSegmentResponse[] = []
    do {
      const listContainerResponse: Models.ServiceListContainersSegmentResponse = await serviceURL.listContainersSegment(
        Aborter.none,
        marker
      )
      marker = listContainerResponse.nextMarker
      listContainer.push(listContainerResponse)
    } while(marker)
    for(const list of listContainer) {
      for await(const container of list.containerItems) {
        const containerURL = ContainerURL.fromServiceURL(serviceURL, container.name)
        marker = undefined 
        let childNode: ITreeNode[] = []
        do {
          const listBlobResponse: Models.ContainerListBlobFlatSegmentResponse = await containerURL.listBlobFlatSegment(
            Aborter.none,
            marker
          )
          marker = listBlobResponse.nextMarker
          for(const blob of listBlobResponse.segment.blobItems) {
            childNode.push({
              id: i,
              icon: "document",
              label: blob.name,
              nodeData: {
                id: i,
                icon: "document",
                name: blob.name, 
                modified: blob.properties.creationTime,
                link: `${this.uri}/${container.name}/${blob.name}?${this.token}`
              }
            })
            i++
          }
        } while(marker)
        node.push({
          id: i,
          icon: "folder-close",
          isExpanded: true,
          label: container.name,
          childNodes: childNode,
        })
        i++
      }
    }
    return node
  }
}
*/

export const getServiceURL = ( uri: string, token: string ): azblob.ServiceURL => {
  const pipeline = azblob.StorageURL.newPipeline(
    new azblob.AnonymousCredential(), {
      retryOptions: { maxTries: 4 }
    }
  )
  const serviceURL = new azblob.ServiceURL(
    `${uri}?${token}`,
    pipeline
  )
  return serviceURL
}


export const getContainers = async (serviceURL: azblob.ServiceURL) => {
  let listContainers: azblob.Models.ContainerItem[] = []
  let marker
  try {
    do {
      const listContainerResponse: azblob.Models.ServiceListContainersSegmentResponse = await serviceURL.listContainersSegment(
        azblob.Aborter.none,
        marker
      )
      if(listContainerResponse === undefined) {
        return listContainers
      }
      marker = listContainerResponse.nextMarker
      for(const container of listContainerResponse.containerItems) {
        listContainers.push(container)
      }
    } while(marker)
      return listContainers
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const getBlobs = async (service: azblob.ServiceURL, containerName: string) => {
  let listBlobs: azblob.Models.BlobItem[] = []
  const containerURL = azblob.ContainerURL.fromServiceURL(service, containerName)
  let marker
  try {
    do {
      const listBlobResponse: azblob.Models.ContainerListBlobFlatSegmentResponse = await containerURL.listBlobFlatSegment(
        azblob.Aborter.none,
        marker
      )
      marker = listBlobResponse.nextMarker
      for(const blob of listBlobResponse.segment.blobItems ) {
        listBlobs.push(blob)
      }
    } while(marker)
    return listBlobs
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const getData = async (container: string, path: string, index: number) => {
  // list all containers
  if (container === "") {
    const uri = "https://svcdemo.blob.core.windows.net/"
    const token = "sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-10-13T01:17:19Z&st=2019-09-06T17:17:19Z&spr=https&sig=3wWQ6igQJF957V0Rbx4n2pT5SnUyFv0zNoxz0lPfxnM%3D"
    const serviceURL = getServiceURL(uri, token)
    const listContainers = await getContainers(serviceURL)
    console.log(listContainers)

  }
}

export const createContainer = async (service: azblob.ServiceURL, containerName: string) => {
  const containerURL = azblob.ContainerURL.fromServiceURL(service, containerName.toLowerCase())
  try {
    await containerURL.create(azblob.Aborter.none)
  } catch {
    console.log("Can't create a container")
  }
}

export const deleteBlob = async (service: azblob.ServiceURL, containerName: string, blobName: string) => {
  const containerURL = azblob.ContainerURL.fromServiceURL(service, containerName)
  const blobURL = azblob.BlobURL.fromContainerURL(containerURL, blobName)
  try {
    await blobURL.delete(azblob.Aborter.none)
  } catch {
    console.log("Can't delete the blob")
  }
}
  /*
export const uploadBlob = async (
  service: azblob.ServiceURL,
  containerName: string,
  blobName: string,
  browserFile: Blob | ArrayBuffer | ArrayBufferView,
  onProgress: (progress: TransferProgressEvent) => any,
  ) => {
  const containerURL = azblob.ContainerURL.fromServiceURL(service, containerName)
  const blobURL = azblob.BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = azblob.BlockBlobURL.fromBlobURL(blobURL)
    //console.log(containerURL)
    //console.log(blobURL)
    //console.log(blockBlobURL)
  await azblob.uploadBrowserDataToBlockBlob(azblob.Aborter.none, browserFile, blockBlobURL, {
    blockSize: 4 * 1024 * 1024, // 4MB block size
    parallelism: 20, // 20 concurrency
    progress: ev => {
      console.log(ev)
      onProgress((progress: any) => ev)
    }
  })
  console.log("Complete")
}
  */


  /*
const getContainer = async () => {
  const uri = "https://svcdemo.blob.core.windows.net/"
  const token = "sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-10-13T01:17:19Z&st=2019-09-06T17:17:19Z&spr=https&sig=3wWQ6igQJF957V0Rbx4n2pT5SnUyFv0zNoxz0lPfxnM%3D"
  const serviceURL = getServiceURL(uri, token)

  const data: Types.Blob[] = []
  const listContainers = await getContainers(serviceURL)
  let i = 0
  for(const container of listContainers) {
    const data: Types.Blob = {
      key: i,
      icon: "inbox",
      name: container.name,

      //modified: utils.formatDate(container.properties.lastModified),
    }
    containers.push(data)
    i++
  }
  this.data.container = containers
  this.data.folder = []
  this.data.file = []
  return
}

// path: "/Folder 1/Folder 2"
const getBlob = async () => {
  const uri = "https://svcdemo.blob.core.windows.net/"
  const token = "sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-10-13T01:17:19Z&st=2019-09-06T17:17:19Z&spr=https&sig=3wWQ6igQJF957V0Rbx4n2pT5SnUyFv0zNoxz0lPfxnM%3D"
  const serviceURL = api.azure.getServiceURL(uri, token)
  const listBlobs = await getBlobs(serviceURL, container)

  let folder: Types.Blob[] = []
  let file: Types.Blob[] = []
  let i = 0
  let j = 0
  let flag = true
  let path = ""
  for(const blob of listBlobs) {
    const blobPathArray = blob.name.split("/")
    //console.log(blobPathArray)
    if(blobPathArray[this.current.index] !== undefined) {
      if(path === blobPathArray[this.current.index]) {
        continue
      }

      if(this.current.index > 0 && flag) {
        this.current.path = blobPathArray[this.current.index-1]
        flag = false
      }
      // if is length > index+1 -> is a folder
      if(blobPathArray.length > (this.current.index + 1)) {
        const data: Types.Blob = {
          key: i,
          icon: "folder-close",
          name: blobPathArray[this.current.index],
          onClick: this.openFolder,
        }
        //console.log(blobPathArray[this.current.index])
        path = blobPathArray[this.current.index]
        folder.push(data)
        i++
        continue
      }
      // if is length === index+1 -> is a file
      if(blobPathArray.length === (this.current.index + 1)) {
        const data: Types.Blob = {
          key: j,
          icon: "document",
          name: blobPathArray[this.current.index],
          size: utils.formatBytes(blob.properties.contentLength!),
          sizeRaw: blob.properties.contentLength,
          modified: utils.formatDate(blob.properties.creationTime!),
          modifiedRaw: blob.properties.creationTime,
          link: `${this.cookie.uri}${this.current.container}/${blob.name}?${this.cookie.token}`,
        }
        file.push(data)
        j++
        continue
      }
    }
  }
  this.data.container = []
  this.data.folder = folder
  this.data.file = file
  return
}


*/

  /*
const getList = (uri: string, token: string): any => {  
  const serviceURL = this.getServiceURL()
  let i = 1
  let marker
  let listContainer: Models.ServiceListContainersSegmentResponse[] = []
  do {
    const listContainerResponse: Models.ServiceListContainersSegmentResponse = await serviceURL.listContainersSegment(
      Aborter.none,
      marker
    )
    marker = listContainerResponse.nextMarker
    listContainer.push(listContainerResponse)
  } while(marker)
  for(const list of listContainer) {
    for await(const container of list.containerItems) {
      const containerURL = ContainerURL.fromServiceURL(serviceURL, container.name)
      marker = undefined 
      let childNode: ITreeNode[] = []
      do {
        const listBlobResponse: Models.ContainerListBlobFlatSegmentResponse = await containerURL.listBlobFlatSegment(
          Aborter.none,
          marker
        )
        marker = listBlobResponse.nextMarker
        for(const blob of listBlobResponse.segment.blobItems) {
          childNode.push({
            id: i,
            icon: "document",
            label: blob.name,
            nodeData: {
              id: i,
              icon: "document",
              name: blob.name, 
              modified: blob.properties.creationTime,
              link: `${this.uri}/${container.name}/${blob.name}?${this.token}`
            }
          })
          i++
        }
      } while(marker)
      node.push({
        id: i,
        icon: "folder-close",
        isExpanded: true,
        label: container.name,
        childNodes: childNode,
      })
      i++
    }
  }
  return node
}
   */



/*
 *
export const getServiceURL = (): ServiceURL => {

  let cookie = new Cookie()
  const uri: string = cookie.get("uri")
  const token: string = cookie.get("token")

  const pipeline = StorageURL.newPipeline(
    new AnonymousCredential(), {
      retryOptions: { maxTries: 4 }
    }
  )

  const serviceURL = new ServiceURL(
    `${uri}?${token}`,
    pipeline
  )
  return serviceURL
}

export const TokenCheck = async (serviceURL: ServiceURL) => {
  //const serviceURL = getServiceURL()
  try {
    const info = await serviceURL.getAccountInfo(Aborter.timeout(5000))
    const currentTime = new Date().getTime()
    const tokenTime = info.date!.getTime()
    if (tokenTime >= currentTime) {
        return true
    }
  } catch {
    return false
  }
}


export const GetNodeTree = async () => {
  let cookie = new Cookie()
  const uri: string = cookie.get("uri")
  const token: string = cookie.get("token")

  const serviceURL = getServiceURL()
  let i = 1
  let node: ITreeNode[] = []
  
  let marker
  let listContainer: Models.ServiceListContainersSegmentResponse[] = []
  
  do {
    const listContainerResponse: Models.ServiceListContainersSegmentResponse = await serviceURL.listContainersSegment(
      Aborter.none,
      marker
    )
    marker = listContainerResponse.nextMarker
    listContainer.push(listContainerResponse)
  } while(marker)
  
  for(const list of listContainer) {
    for await(const container of list.containerItems) {
      const containerURL = ContainerURL.fromServiceURL(serviceURL, container.name)
      marker = undefined 
      let childNode: ITreeNode[] = []
      
      do {
        const listBlobResponse: Models.ContainerListBlobFlatSegmentResponse = await containerURL.listBlobFlatSegment(
          Aborter.none,
          marker
        )
        marker = listBlobResponse.nextMarker
        for(const blob of listBlobResponse.segment.blobItems) {
          childNode.push({
            id: i,
            icon: "document",
            isExpanded: false,
            label: blob.name,
            nodeData: { 
              downloadLink:`${uri}/${container.name}/${blob.name}?${token}`
            }
          })
          i++
        }
      } while(marker)

      node.push({
        id: i,
        icon: "folder-close",
        isExpanded: false,
        label: container.name,
        childNodes: childNode,
      })
      i++
    }
  }
  return node
}


*/
/*
 * Azure 12.preview.2
 *

export const GetNodeTree = async () => {
  const serviceURL = getServiceURL()
  let i = 1
  let node: ITreeNode[] = []
  for await (const container of blobServiceClient.listContainers()) {
    const containerClient = blobServiceClient.getContainerClient(container.name)
    let childNode: ITreeNode[] = []
    for await (const blob of containerClient.listBlobsFlat()) {
      childNode.push({
        id: i,
        icon: "document",
        isExpanded: false,
        label: blob.name,
      })
    }
    node.push({
      id: i,
      icon: "folder-close",
      isExpanded: false,
      label: container.name,
      childNodes: childNode,
    })
  }
  return node
}
 */

