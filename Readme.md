# Electron + Create-React-App + GraphQL

This example builds a stand-alone Electron application that uses GraphQL for interprocess communication rather than IPC. On Windows it builds the app into `./dist/win-unpacked/My Electron GraphQL App.exe` and the optional installer into `./dist/My Electron GraphQL App Setup 1.0.0.exe` (OSX and Linux destinations are similar). You can change the name of the application by changing the `name` property in `package.json`.

# Installation

```bash
# start with the obvious step you always need to do with node projects
npm install

# Depending on the packages you install, with Electron projects you may need to do 
# an npm rebuild to rebuild any included binaries for the current OS. It's probably
# not needed here but I do it out of habit because its fast and the issues can be
# a pain to track down if they come up and you dont realize a rebuild is needed
npm rebuild

# run a dev build of electron
npm run start

# Build the electron app into a subdirectory of dist/, then run electron-packager to 
# package the electron app as a platform-specific installer in dist/
npm run build

# double-click to run the either the platform-specific app that is built into 
# a subdirectory of dist/ or the platform-specific installer that is built and 
# placed in the dist/ folder
```

# Debugging the GraphQL server

To test the GraphQL server, run `npm run start`, then browse to `http://127.0.0.1:5000/graphiql/` to access a GraphiQL view of the server. For a more detailed example, try `http://127.0.0.1:5000/graphiql/?query={calc(math:"1/2",signingkey:"devkey")}` which works great if you copy and paste into the browser but which is a complex enough URL that it will confuse chrome if you try to click directly on it.

# Notes

The electron renderer process communicates with the main process via GraphQL web service calls.
