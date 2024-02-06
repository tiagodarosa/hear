import { setupMainExpressApp } from "./app";
import { serializeError } from "serialize-error";
import { Server } from "http";
import { Express } from "express";
import { Db, MongoClient } from "mongodb";

let server: Server;
export let db: Db;

function setupExpressServer(app: Express): Server {
  //TODO: Use an environment variable to update this information when necessary
  const port = app.get("port") as number;

  return app.listen(port, () => {
    console.log(`Meals is running at port ${port}.`);
  });
}

async function startup(): Promise<void> {
  try {
    //TODO: Use an environment variable to update this information and store in a safe place
    const client = new MongoClient(
      "mongodb+srv://username:DsRfaqaCr0GpnY60@cluster0.ixlb8nu.mongodb.net/"
    );
    //TODO: Create a service to manage the database connection
    db = client.db("meals");
    const mainApp = setupMainExpressApp();
    server = setupExpressServer(mainApp);
  } catch (error) {
    const errorDetails = JSON.stringify(serializeError(error));
    console.error(`Error starting up the server: ${errorDetails}`);
  }
}

void startup();
