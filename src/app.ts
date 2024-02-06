import express, { Express, Handler } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import path from "path";
import cors from "cors";
import * as OpenApiValidator from "express-openapi-validator";
import { connector } from "swagger-routes-express";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import { ErrorsHandler } from "./middleware/ErrorsHandler";
import * as publicApiControllers from "./controllers/index";
import { BusinessLogicError } from "./util/Exceptions";

interface HasName {
  name?: string;
}

function setExpressOpenApiConfiguration(
  app: Express,
  yamlSpecFilePath: string,
  controllers: Record<string, Handler>,
  apiDocPath: string
): void {
  // Validator
  app.use(
    OpenApiValidator.middleware({
      apiSpec: yamlSpecFilePath,
      validateRequests: true,
      validateResponses: true,
      validateFormats: "full",
      fileUploader: false,
      coerceTypes: false,
      validateSecurity: false,
      ignorePaths: /^\/v1+\/(((api(\/.*)?)))?$/,
    })
  );

  // openapi
  const openApiDocument = YAML.load(yamlSpecFilePath) as object;
  const connect = connector(controllers, openApiDocument, {
    onCreateRoute: (method: string, descriptor: unknown[]) => {
      const padNum = 7;
      console.log(
        `${method.padEnd(padNum).toUpperCase()}: ${String(descriptor[0])} : ${
          (descriptor[1] as HasName).name
        }`
      );
    },
  });

  connect(app);

  // Swagger doc
  app.use(
    apiDocPath,
    swaggerUI.serveFiles(openApiDocument),
    swaggerUI.setup(openApiDocument)
  );
}

export function setupPublicExpressApp(): Express {
  const app = express();
  setExpressOpenApiConfiguration(
    app,
    path.join(__dirname, "public", "meals-v1.openapi.yaml"),
    publicApiControllers,
    "/v1/api"
  );

  return app;
}

export function setupMainExpressApp(): Express {
  const app = express();
  // Redirect to Swagger Doc
  app.get("/", function (req, res) {
    res.redirect("/v1/api/");
  });
  app.set("port", 3000);
  app.use(compression());
  app.use(
    bodyParser.json({
      limit: "5Mb",
      type: ["application/json"],
    })
  );
  //TODO: Use an environment variable to update this information when necessary
  app.use(bodyParser.urlencoded({ limit: "5Mb", extended: true }));
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));

  const apiV1 = setupPublicExpressApp();

  // Routes
  app.use(function (req, res, next) {
    const requestUrl = /^.*\/(v[0-9]+)\/.*$/.exec(req.url);
    const apiVersion = requestUrl?.[1];
    switch (apiVersion) {
      case "v1":
        apiV1(req, res, next);
        break;
      default:
        throw new BusinessLogicError(`Path '${req.url}' not found.`);
    }
  });

  // Error
  app.use(ErrorsHandler);
  return app;
}
