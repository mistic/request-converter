import {
  convertRequests,
  listFormats,
  FormatExporter,
  ConvertOptions,
} from "../src/convert";
import { ParsedRequest } from "../src/parse";

const devConsoleScript = `GET /

POST /my-index/_search?from=40&size=20
{
  "query": {
    "term": {
      "user.id": "kimchy's"
    }
  }
}`;

const devConsoleScriptCodeGenName = `
PUT /_snapshot/my_repository
{
  "type": "fs",
  "settings": {
  "location": "my_backup_location"
  }
}
`

describe("convert", () => {
  it("checks for curl", async () => {
    expect(
      await convertRequests(devConsoleScript, "curl", {
        checkOnly: true,
      }),
    ).toBeTruthy();
  });

  it("checks for python", async () => {
    expect(
      await convertRequests(devConsoleScript, "python", {
        checkOnly: true,
      }),
    ).toBeTruthy();
  });

  it("checks for javascript", async () => {
    expect(
      await convertRequests(devConsoleScript, "javascript", {
        checkOnly: true,
      }),
    ).toBeTruthy();
  });


  it("checks for java", async () => {
    expect(
      await convertRequests(devConsoleScript, "java", {
        checkOnly: true,
      }),
    ).toBeTruthy();
  });

  it("errors for unknown language", async () => {
    expect(
      async () =>
        await convertRequests(devConsoleScript, "perl", {
          checkOnly: true,
        }),
    ).rejects.toThrowError("Invalid output format");
  });

  it("converts to curl", async () => {
    expect(
      await convertRequests(devConsoleScript, "curl", {
        elasticsearchUrl: "http://localhost:9876",
      }),
    ).toEqual(
      'curl -X GET "http://localhost:9876/"\ncurl -X POST -H "Content-Type: application/json" -d \'{"query":{"term":{"user.id":"kimchy\'"\'"\'s"}}}\' "http://localhost:9876/my-index/_search?from=40&size=20"\n',
    );
  });

  it("converts to curl", async () => {
    expect(
      await convertRequests(devConsoleScript, "curl", {
        elasticsearchUrl: "http://localhost:9876",
        windows: true,
      }),
    ).toEqual(
      'curl -X GET "http://localhost:9876/"\ncurl -X POST -H "Content-Type: application/json" -d \'{"query":{"term":{"user.id":"kimchy\'\'s"}}}\' "http://localhost:9876/my-index/_search?from=40&size=20"\n',
    );
  });

  it("converts to python", async () => {
    expect(await convertRequests(devConsoleScript, "python", {})).toEqual(
      `resp = client.info()

resp1 = client.search(
    index="my-index",
    from_="40",
    size="20",
    query={
        "term": {
            "user.id": "kimchy's"
        }
    },
)

`,
    );
  });

  it("converts to python and prints the response", async () => {
    expect(
      await convertRequests(devConsoleScript, "python", {
        printResponse: true,
      }),
    ).toEqual(
      `resp = client.info()
print(resp)

resp1 = client.search(
    index="my-index",
    from_="40",
    size="20",
    query={
        "term": {
            "user.id": "kimchy's"
        }
    },
)
print(resp1)

`,
    );
  });

  it("converts to a complete python script", async () => {
    expect(
      await convertRequests(devConsoleScript, "python", {
        complete: true,
        elasticsearchUrl: "https://localhost:9999",
      }),
    ).toEqual(
      `import os
from elasticsearch import Elasticsearch

client = Elasticsearch(
    hosts=["https://localhost:9999"],
    api_key=os.getenv("ELASTIC_API_KEY"),
)

resp = client.info()

resp1 = client.search(
    index="my-index",
    from_="40",
    size="20",
    query={
        "term": {
            "user.id": "kimchy's"
        }
    },
)

`,
    );
  });

  it("converts an unsupported API to python", async () => {
    expect(
      await convertRequests("GET /_internal/desired_balance", "python", {
        complete: false,
        elasticsearchUrl: "https://localhost:9999",
      }),
    ).toEqual(
      `resp = client.perform_request(
    "GET",
    "/_internal/desired_balance",
)

`,
    );
  });

  it("converts to javascript", async () => {
    expect(await convertRequests(devConsoleScript, "javascript", {})).toEqual(
      `const response = await client.info();

const response1 = await client.search({
  index: "my-index",
  from: 40,
  size: 20,
  query: {
    term: {
      "user.id": "kimchy's",
    },
  },
});
`,
    );
  });

  it("converts to a complete javascript snippet with full async compatibility", async () => {
    expect(
      await convertRequests(devConsoleScript, "javascript", { complete: true }),
    ).toEqual(
      `const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  nodes: [process.env["ELASTICSEARCH_URL"]],
  auth: {
    apiKey: process.env["ELASTIC_API_KEY"],
  },
});

async function run() {
  const response = await client.info();

  const response1 = await client.search({
    index: "my-index",
    from: 40,
    size: 20,
    query: {
      term: {
        "user.id": "kimchy's",
      },
    },
  });
}

run();
`,
    );
  });

  it("converts to java", async () => {
    expect(await convertRequests(devConsoleScript, "java", {})).toEqual(
`esClient.info();

esClient.search(s -> s
\t.from(40)
\t.index("my-index")
\t.query(q -> q
\t\t.term(t -> t
\t\t\t.field("user.id")
\t\t\t.value(FieldValue.of("kimchy's"))
\t\t)
\t)
\t.size(20)
,Void.class);
`,
    );
  });

  it("converts to java as a complete class", async () => {
    expect(await convertRequests(devConsoleScript, "java", { complete: true })).toEqual(
      `package org.example;

import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import java.io.IOException;

public class Example {

\tpublic static void main(String[] args) throws IOException {
\t\tString serverUrl = "http://localhost:9200";

\t\ttry (RestClient restClient = RestClient.builder(HttpHost.create(serverUrl)).build()) {

\t\t\tElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

\t\t\tElasticsearchClient esClient = new ElasticsearchClient(transport);

\t\t\tesClient.info();

\t\t\tesClient.search(
\t\t\t\t\ts -> s.from(40).index("my-index")
\t\t\t\t\t\t\t.query(q -> q.term(t -> t.field("user.id").value(FieldValue.of("kimchy's")))).size(20),
\t\t\t\t\tVoid.class);

\t\t}
\t}
}
`,
    );
  });

  it("converts to java with codegen names", async () => {
    expect(await convertRequests(devConsoleScriptCodeGenName, "java", {})).toEqual(
      `esClient.snapshot().createRepository(c -> c
\t.name("my_repository")
\t.repository(r -> r
\t\t.fs(f -> f
\t\t\t.settings(s -> s
\t\t\t\t.location("my_backup_location")
\t\t\t)
\t\t)
\t)
);
`,
    );
  });

  it("supports a custom exporter", async () => {
    class MyExporter implements FormatExporter {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async check(requests: ParsedRequest[]): Promise<boolean> {
        return true;
      }
      async convert(
        requests: ParsedRequest[],
        options: ConvertOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
      ): Promise<string> {
        return requests.map((req) => req.api).join("\n");
      }
    }

    expect(
      await convertRequests(
        "GET /my-index/_search\nGET /\n",
        new MyExporter(),
        {},
      ),
    ).toEqual("search\ninfo");
  });

  it("returns the list of available formats", () => {
    expect(listFormats()).toContain("python");
  });
});
