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

import { ChangeEvent } from 'react'
import { observable, action } from 'mobx'
import * as Types from './types'
import api from '../api'
import { RootStore } from './rootStore'
import {
  Intent,
  Toaster,
  IToastProps,
} from "@blueprintjs/core";
//import { StorageBlob } from '../api/azure-v10'

export class AuthStore {
  root: RootStore
  constructor(root: RootStore) {
    this.root = root
  }

  //
  // UI store
  //

  @observable account = { name: "", key: ""  }
  @observable authMessage: Toaster

  refHandlers = {
    toaster: (ref: Toaster) => this.authMessage = ref,
  }


  authMessageContent: IToastProps = {
    icon: "warning-sign",
    intent: Intent.DANGER,
    message: "ACCOUNT NAME or ACCOUNT KEY incorrect.",
  }

  showAuthMessage = (toast: IToastProps) => {
    //toast.className = this.props.data.themeName;
    toast.timeout = 10000
    this.authMessage.show(toast)
  }

  // Events
  @action eventAccountName = (e: ChangeEvent<HTMLInputElement>) => {
    this.account.name = e.target.value
  }

  @action eventAccountKey = (e: ChangeEvent<HTMLInputElement>) => {
    this.account.key = e.target.value
  }

  @action eventOnKeyPress = (e: Types.KeyboardEvent) => {
    if (e.key === "Enter") {
      this.authenticate()
    }
  }

  //
  // Auth store
  //

  @observable cookie: { uri: string, token: string, } = {
    uri: "",
    token: "",
  }
  @observable isConnected: boolean = false

  @action authenticate = async () => {
    if(!this.isConnected) {
      await this.login()
    } else {
      this.logout()
    }
  }

  @action login = async () => {
    try {
      const resp = await api.auth.login(this.account.name, this.account.key)
      if(resp) {
        this.setToLogout()
      } else {
        this.showAuthMessage(this.authMessageContent)
      }
    } catch {}
  }

  @action logout = () => {
    // Remove cookie
    api.auth.logout()
    // Logout
    this.setToLogin()
  }

  @action checkToken = () => {
    return false
  }

  @action setToLogin = () => {
    this.isConnected = false
  }

  @action setToLogout = () => {
    this.account = { name: "", key: "" }
    this.isConnected = true
  }

  @action getCookie = () => {
    this.cookie = api.auth.getCookie()
  }
}

export default AuthStore
