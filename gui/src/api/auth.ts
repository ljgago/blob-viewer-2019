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

import axios from 'axios'
import Cookie from 'universal-cookie'

export const login = async (accountName: string, accountKey: string) => {
  try {
    let resp = await axios.post("/login", {
      accountName: accountName,
      accountKey: accountKey
    })
    if (resp.data["uri"] !== "" && resp.data["token"] !== "") {
      let cookie = new Cookie()
      cookie.set("uri", resp.data["uri"], {
        path: "/",
        maxAge: 2592000,
      })
      cookie.set("token", resp.data["token"], {
        path: "/",
        maxAge: 2592000,
      })
      return true
    }
    return false
  } catch (err) {
    console.error(err)
    return false
  }
}

export const logout = () => {
  let cookie = new Cookie()
  cookie.remove("uri", { path: "/" })
  cookie.remove("token", { path: "/" })
}

export const getCookie = () => {
  let cookie = new Cookie()
  const uri = cookie.get("uri")
  const token = cookie.get("token")
  if(uri === undefined || token === undefined) {
    return {
      uri: "",
      token: "",
    }
  }
  return {
    uri: uri,
    token: token,
  }
}
