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

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatBytesSpeed = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const formatDate = (date: Date): string => {
  return date.getFullYear()
    + "/"
    + (date.getMonth() + 1)
    + "/"
    + date.getDate()
    + " - "
    + date.getHours()
    + ":"
    + date.getMinutes()
    + ":"
    + date.getSeconds()
}

// Sort object by name in alphabetic mode (A to Z)
export const aToZSort = (a: any, b: any): number => {
  if(a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1
  }
  if(a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1
  }
  return 0
}

// Sort object by name in inverser alphabetic mode (Z to A)
export const zToASort = (a: any, b: any): number => {
  if(a.name.toLowerCase() < b.name.toLowerCase()) {
    return 1
  }
  if(a.name.toLowerCase() > b.name.toLowerCase()) {
    return -1
  }
  return 0
}


// Sort object by size of min to max
export const minToMaxSort = (a: any, b: any): number => {
  if(a.size < b.size) {
    return -1
  }
  if(a.size > b.size) {
    return 1
  }
  return 0
}

// Sort object by size of max to min
export const maxToMinSort = (a: any, b: any): number => {
  if(a.size < b.size) {
    return 1
  }
  if(a.size > b.size) {
    return -1
  }
  return 0
}

// Sort object by date of old to new
export const oldToNewSort = (a: any, b: any): number => {
  if((a.modifiedRaw - b.modifiedRaw) < 0) {
    return 1
  }
  if((a.modifiedRaw - b.modifiedRaw) > 0) {
    return -1
  }
  return 0
}

// Sort object by date of new to old
export const newToOldSort = (a: any, b: any): number => {
  if((a.modifiedRaw - b.modifiedRaw) < 0) {
    return -1
  }
  if((a.modifiedRaw - b.modifiedRaw) > 0) {
    return 1
  }
  return 0
}

export const urlJoin = (...strArray: any) => {
  var resultArray = []

  if (strArray.length === 0) {
    return ''
  }

  if (typeof strArray[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + strArray[0])
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    let first = strArray.shift()
    strArray[0] = first + strArray[0]
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///')
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://')
  }

  for (var i = 0; i < strArray.length; i++) {
    let component = strArray[i]
    if (typeof component !== 'string') {
      throw new TypeError('Url must be a string. Received ' + component);
    }
    if (component === '') {
      continue
    }
    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[\/]+/, '')
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[\/]+$/, '')
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[\/]+$/, '/')
    }
    resultArray.push(component);
  }

  let str = resultArray.join('/');
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  let parts = str.split('?')
  str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&')
  return str
}


export const progressCalc = (maxBytes: number, loadedBytes: number): number => {
  return loadedBytes / maxBytes
}

export const progressCalcPsercenterStr = (maxBytes: number, loadedBytes: number): string => {
  return (loadedBytes / maxBytes * 100).toFixed(0).toString()
}

// Queue class
export class Queue {
  items: any
    // Array is used to implement a Queue 
  constructor() {
      this.items = []
  }
  // Functions to be implemented 
  enqueue = (item: any) => {
    this.items.push(item)
  }

  dequeue = () => {
    if(this.isEmpty()) {
      return null
    }
    return this.items.shift()
  }

  front = () => {
    if(this.isEmpty()) {
      return null
    }
    return this.items[0]
  }

  isEmpty = (): boolean => {
    return this.items.length === 0
  }

  hasOnlyOne = (): boolean => {
    return this.items.length === 1
  }
}

// get the block size 256kB, 1MB, 4MB, 16MB, 64MB, 100MB
export const getBlockSize = (bytes: number): number => {
  // the real maxNumBlock suported is 50000
  const maxNumBlock = 10000
  const blockSize = bytes/maxNumBlock
  if(blockSize < 256*1024) {
    return 256*1024
  } else if(blockSize < 1*1024*1024) {
    return 1*1024*1024
  } else if(blockSize < 4*1024*1024) {
    return 4*1024*1024
  } else if(blockSize < 16*1024*1024) {
    return 16*1024*1024
  } else if(blockSize < 64*1024*1024) {
    return 64*1024*1024
  } else {
    return 100*1024*1024
  }
}

