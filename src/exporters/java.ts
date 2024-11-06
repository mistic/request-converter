import Handlebars from "handlebars";
import { JavaCaller } from "java-caller";
import { ConvertOptions, FormatExporter } from "../convert";
import { JavaParsedRequest, ParsedRequest } from "../parse";
import * as util from "node:util";
import { Request } from "../metamodel";

// this regex should match the list of APIs that the java generator ignores
const UNSUPPORTED_APIS = new RegExp(
  "^_internal.*$" +
    "|^text_structure.find_structure$" +
    "|^fleet.global_checkpoints$" +
    "|^fleet.msearch$" +
    "|^connector.last_sync$",
);

function getCodeGenParamNames(
  params: Record<string, string | undefined>,
  request: Request | undefined,
): Record<string, string | undefined> {
  for (const [key, value] of Object.entries(params)) {
    if (request?.path) {
      for (const prop of request.path) {
        if (prop.name == key && prop.codegenName != undefined) {
          delete params[key];
          params[prop.codegenName] = value;
        }
      }
    }
  }
  return params;
}

export class JavaExporter implements FormatExporter {
  template: Handlebars.TemplateDelegate;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async check(requests: ParsedRequest[]): Promise<boolean> {
    return true;
  }

  async convert(
    requests: ParsedRequest[],
    options: ConvertOptions,
  ): Promise<string> {
    let jsonArray: JavaParsedRequest[] = [];

    requests.forEach((req) => {
      const correctParams = getCodeGenParamNames(req.params, req.request);
      const javaParsedRequest: JavaParsedRequest = {
        api: req.api,
        params: correctParams,
        query: req.query,
        body: req.body,
      };

      jsonArray.push(javaParsedRequest);
    });

    var jsonString = JSON.stringify(jsonArray);

    const java = new JavaCaller({
      minimumJavaVersion: 17,
      jar: "src/exporters/java-es-request-converter-1.0-SNAPSHOT.jar",
    });

    let args: string[] = [];
    args.push(jsonString);
    args.push(options.complete ? 'true' : 'false');
    if (options.elasticsearchUrl != null) {
      args.push(options.elasticsearchUrl);
    }

    console.log(JSON.stringify(jsonArray))

    const { status, stdout, stderr } = await java.run(args);
    console.log(status)
    if (status) {
      console.log(stderr);
      return stderr;
    }
    console.log(stdout);
    return stdout;
  }
}
