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

import { action, computed, observable } from 'mobx'
import { RootStore } from './rootStore'

export class ExplorerStore {
  root: RootStore
  constructor(root: RootStore) {
    this.root = root
  }

  @observable switchView = ""
  @observable view = "viewer"

  @computed get showView() {
    return this.view[0].toUpperCase() + this.view.slice(1)
  }

  @computed get showColorView() {
    switch(this.view) {
      case "viewer":
        return "#48aff0"
      case "upload":
        return "#3dcc91"
      case "setting":
        return "#ff7373"
      default:
        return "#48aff0"
    }
  }

  @computed get showColorIntent() {
    switch(this.view) {
      case "viewer":
        return "primary"
      case "upload":
        return "success"
      case "setting":
        return "danger"
      default:
        return "primary"
    }
  }

  @action setView = (view: string) => () => {
    this.view = view
  }

}

export default ExplorerStore

