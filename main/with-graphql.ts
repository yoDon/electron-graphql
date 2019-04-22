import cors from "cors";
import { ipcMain } from "electron"; // tslint:disable-line
import express from "express";
import express_graphql from "express-graphql";
import getPort from "get-port";
import { buildSchema } from "graphql";
import uuid from "uuid";

const isDev = (process.env.NODE_ENV === "development");

const apiDetails = {
  port:0,
  signingKey:"",
};

const app = express();
app.use(cors());

// GraphQL Schema
const schema = buildSchema(`
  type Query {
    awake: String
    calc(signingkey: String = null, math: String = null): String
    exit(signingkey: String = null): String
    hello(signingkey: String = null): String
  }`);

// Root resolver
const root = {
  awake: () => "Awake",
  calc: (args:{ signingkey:string, math:string }) => {
    if (args.signingkey !== apiDetails.signingKey) {
      return "invalid signature";
    }
    return args.math;
  },
  hello: (args:{ signingkey:string }) => {
    if (args.signingkey !== apiDetails.signingKey) {
      return "invalid signature";
    }
    return "world";
  },
};

app.use("/graphql", express_graphql({
  graphiql: false,
  rootValue: root,
  schema,
}));

app.use("/graphiql", express_graphql({
  graphiql: true,
  rootValue: root,
  schema,
}));

const initializeApi = async () => {
  // dialog.showErrorBox("success", "initializeApi");
  const availablePort = await getPort();
  apiDetails.port = isDev ? 5000 : availablePort;
  const key = isDev ? "devkey" : uuid.v4();
  apiDetails.signingKey = key;
  app.listen(apiDetails.port);
};

ipcMain.on("getApiDetails", (event:Electron.Event) => {
  if (apiDetails.signingKey !== "") {
    event.sender.send("apiDetails", JSON.stringify(apiDetails));
  } else {
    initializeApi()
      .then(() => {
        event.sender.send("apiDetails", JSON.stringify(apiDetails));
      })
      .catch(() => {
        event.sender.send("apiDetailsError", "Error initializing API");
      });
  }
});
