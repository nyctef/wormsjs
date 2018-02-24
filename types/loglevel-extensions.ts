// TODO: contribute this to DefinitelyTyped

import "loglevel";

declare module "loglevel" {
  interface Logger {
    /**
     * This will return you the dictionary of all loggers created with getLogger, keyed off of their names
     */
    getLoggers(): { [name: string]: Logger };
  }
}
