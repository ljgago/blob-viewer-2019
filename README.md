# Blob Viewer

Simple viewer for Azure Blob Storage in Go, React and MobX.

### How build it?

Go to `gui/` folder and build the react-app.

```bash
cd gui/
yarn install
yarn build
cd ..
```

Optional:
You can bundling static assets from react-app with `Packr v2`, just run the next command in the root project folder:

```bash
go get -u github.com/gobuffalo/packr/v2/packr2 && packr2
```

Compile the Go project:

```bash
go build -o blob-viewer
```

### How use it?

Just run the binary app `./blob-viewer`, open the http://localhost:8090 and login with the Azure username and key.
You can use `tls` and your credentials, i.e.

```bash
./blob-viewer -c cert/server.crt -k cert/server.key --tls
```
