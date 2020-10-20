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

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"mime"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/Azure/azure-storage-blob-go/azblob"
	"github.com/go-chi/chi"
	"github.com/gobuffalo/packr/v2"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

type Login struct {
	AccountName string `json:"accountName,omitempy"`
	AccountKey  string `json:"accountKey,omitempy"`
}

type Access struct {
	URI   string `json:"uri,omitempy"`
	Token string `json:"token,omitempy"`
}

func main() {
	Execute()
}

// Root represents the base command when called without any subcommands
var Root = &cobra.Command{
	Use: "blob-viewer",
	Short: `
Azure Blob Viewer`,
	Long:              ``,
	SilenceErrors:     true,
	SilenceUsage:      true,
	DisableAutoGenTag: true,
	Run: func(command *cobra.Command, args []string) {
		runRoot(args)
	},
}

func Execute() {
	if err := Root.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize()

	pflags := Root.PersistentFlags()
	pflags.StringP("port", "p", "8090", "server port")
	pflags.IntP("expire", "e", 48, "access token expire time (in hours)")
	pflags.StringP("cert", "c", "server.crt", "cert file")
	pflags.StringP("key", "k", "server.key", "key file")
	pflags.Bool("tls", false, "enable tls support")

	viper.BindPFlag("port", pflags.Lookup("port"))
	viper.BindPFlag("expire", pflags.Lookup("expire"))
	viper.BindPFlag("cert", pflags.Lookup("cert"))
	viper.BindPFlag("key", pflags.Lookup("key"))
	viper.BindPFlag("tls", pflags.Lookup("tls"))
}

func runRoot(args []string) {
	port := viper.GetString("port")
	cert := viper.GetString("cert")
	key := viper.GetString("key")
	tls := viper.GetBool("tls")

	box := packr.New("webpage", "./gui/build")
	r := chi.NewRouter()

	s, err := box.FindString("index.html")
	if err != nil {
		log.Println(err)
	}
	ico, err := box.Find("favicon.ico")
	if err != nil {
		log.Println(err)
	}
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		// w.Header().Set("Access-Control-Allow-Origin", "*")
		// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		// w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		// w.Header().Set("Content-Type", "text/html")
		w.Write([]byte(s))
	})
	r.Get("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		// w.Header().Set("Access-Control-Allow-Origin", "*")
		// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		// w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		// w.Header().Set("Content-Type", "image/x-icon")
		w.Write(ico)
	})
	r.Post("/login", login)
	fileServer(r, "/static/", box)
	if tls {
		fmt.Println("Server with TLS on port :" + port)
		http.ListenAndServeTLS(":"+port, cert, key, r)
	} else {
		fmt.Println("Server whitout TLS on port :" + port)
		http.ListenAndServe(":"+port, r)
	}
	fmt.Println("Server closed")
}

func fileServer(r chi.Router, path string, box *packr.Box) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit URL parameters.")
	}
	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"
	r.Get(path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := r.URL.Path[1:]
		//data, err := ioutil.ReadFile(string(path))
		data, err := box.FindString(string(p))
		if err == nil {
			var contentType string
			splitPath := strings.Split(p, ".")
			ext := splitPath[len(splitPath)-1]
			contentType = mime.TypeByExtension("." + ext)
			// w.Header().Set("Access-Control-Allow-Origin", "*")
			// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			// w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
			// w.Header().Set("Content-Type", "image/x-icon")
			w.Header().Add("Content-Type", contentType)
			w.Write([]byte(data))
		} else {
			w.WriteHeader(404)
			w.Write([]byte("404 My dear - " + http.StatusText(404)))
		}
	}))
}

func login(w http.ResponseWriter, r *http.Request) {
	expireTime := viper.GetInt("expire")
	decoder := json.NewDecoder(r.Body)

	var login Login
	err := decoder.Decode(&login)
	if err != nil {
		log.Println(err)
	}
	if login.AccountName != "" && login.AccountKey != "" {
		uri, token, err := generateSharedKeyCredential(login.AccountName, login.AccountKey, expireTime)
		if err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(401), 401)
			return
		}
		// check the credential
		u, _ := url.Parse(fmt.Sprintf("https://%s.blob.core.windows.net?%s", login.AccountName, token))
		serviceURL := azblob.NewServiceURL(*u, azblob.NewPipeline(azblob.NewAnonymousCredential(), azblob.PipelineOptions{}))
		ctx := context.Background()
		_, err = serviceURL.GetProperties(ctx)
		if err != nil {
			log.Println(err)
			http.Error(w, http.StatusText(401), 401)
			return
		}
		log.Printf("URI: %s\nToken: %s\n", uri, token)
		data := Access{
			URI:   uri,
			Token: token,
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	http.Error(w, http.StatusText(401), 401)
}

func generateSharedKeyCredential(accountName, accountKey string, expireTime int) (string, string, error) {
	fmt.Println("User: " + accountName)
	fmt.Println("Key: " + accountKey)
	credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		return "", "", err
	}
	// Set the desired SAS signature values and sign them with the shared key credentials to get the SAS query parameters.
	sasQueryParams, err := azblob.AccountSASSignatureValues{
		Protocol:   azblob.SASProtocolHTTPSandHTTP,                              // Users MUST use HTTPS (not HTTP)
		ExpiryTime: time.Now().UTC().Add(time.Duration(expireTime) * time.Hour), // 48-hours before expiration
		Permissions: azblob.AccountSASPermissions{
			Read:    true,
			Write:   true,
			Delete:  true,
			List:    true,
			Add:     true,
			Create:  true,
			Update:  true,
			Process: true,
		}.String(),
		Services: azblob.AccountSASServices{Blob: true}.String(),
		ResourceTypes: azblob.AccountSASResourceTypes{
			Service:   true,
			Container: true,
			Object:    true,
		}.String(),
	}.NewSASQueryParameters(credential)
	if err != nil {
		return "", "", err
	}
	token := sasQueryParams.Encode()
	uri := fmt.Sprintf("https://%s.blob.core.windows.net/", accountName)
	return uri, token, nil
}
