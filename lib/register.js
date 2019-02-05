"use strict";

function register(basePath, {models, authenticator, swagger, logger, simpleDao, config}) {
  const fs = require("fs");
  const resources = fs.readdirSync(basePath);

  if (Array.isArray(resources)) {
    resources.forEach((r) => {
      const handlersPath = `${basePath}/${r}/handlers`;
      const modelsPath = `${basePath}/${r}/models`;
      if (fs.existsSync(handlersPath)) {
        const handlers = fs.readdirSync(handlersPath);
        handlers.forEach((h) => {
          const handlerPath = `${handlersPath}/${h}`;
          try {
            const Handler = require(handlerPath).Handler;
            Handler.register({ authenticator, swagger, logger, simpleDao, config });
          } catch (e) {
            logger.error("register:error", handlerPath, e);
          }
        });
      }
      if (!models) {
        models = {models: {}}
      }
      if (typeof models.models !== "object") {
        models = { models: {}}
      }
      if (fs.existsSync(modelsPath)) {
        try {
          const resourceModels = require(modelsPath).models();
          models.models = Object.assign(models.models, resourceModels);
        } catch (e) {
          logger.error("register:error", modelsPath, e);
        }
      }
    });
  }
  swagger.addModels(models);
}

exports.registerModules = register;