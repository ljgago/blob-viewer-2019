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

import { createContext } from 'react'

import AuthStore      from './authStore'
import ExplorerStore  from './explorerStore'
import SettingStore   from './settingStore'
import UploadStore    from './uploadStore'
import ViewerStore    from './viewerStore'

export class RootStore {
  auth: AuthStore
  explorer: ExplorerStore
  setting: SettingStore
  upload: UploadStore
  viewer: ViewerStore
  constructor() {
    this.auth     = new AuthStore(this)
    this.explorer = new ExplorerStore(this)
    this.setting  = new SettingStore(this)
    this.upload   = new UploadStore(this)
    this.viewer   = new ViewerStore(this)
  }
}

const rootStore = new RootStore()
export const rootContext = createContext(rootStore)
export default RootStore

