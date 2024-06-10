# request-converter

Library that converts Elasticsearch requests in Dev Console syntax to other formats.

## Installation

```bash
npm install @elastic/request-converter
```

## Usage

```typescript
import { convertRequests } from "@elastic/request-converter";

const devConsoleScript = `GET /my-index-000001/_search?from=40&size=20
{
  "query": {
    "term": {
      "user.id": "kimchy"
    }
  }
}`

async function main() {
  const code = await convertRequests(devConsoleScript, "python", {
    checkOnly: false,
    printResponse: true,
    complete: true,
    elasticsearchUrl: "http://localhost:9200",
  });
  console.log(code);
}

main();
```

The list of available formats that can be passed in the second argument can be
obtained as follows:

```typescript
import { listFormats } from "@elastic/request-converter";

const formats = listFormats();
```

The ouput code in the example above would look like this:

```python
import os
from elasticsearch import Elasticsearch

client = Elasticsearch(
    hosts=["http://localhost:9200"],
    api_key=os.getenv("ELASTIC_API_KEY"),
)

resp = client.search(
    index="my-index-000001",
    from_="40",
    size="20",
    query={
        "term": {
            "user.id": "kimchy"
        }
    },
)
```

When using Node and JavaScript, you can import the functions in this library as
follows:


```typescript
const { convertRequests, listFormats } = require("@elastic/request-converter");
```

## Command-Line Interface

For convenience, a CLI that wraps the `convertRequests` function is also available.

```bash
$ echo GET / > request.txt
$ node_modules/.bin/es-request-converter --format python --complete < request.txt
import os
from elasticsearch import Elasticsearch

client = Elasticsearch(
    hosts=[os.getenv("ELASTICSEARCH_URL")],
    api_key=os.getenv("ELASTIC_API_KEY"),
)

resp = client.info()
```

## Using a Custom Exporter

Instead of passing the name of one of the available exporters, you can pass a
custom exporter instance.

To define a custom exporter format, create a class that implements the
`FormatExporter` interface. Here is an example exporter that outputs the name
of the API used in the request:

```typescript
import { FormatExporter, convertRequests } from "@elastic/request-converter";

class MyExporter implements FormatExporter {
  async check(requests: ParsedRequest[]): Promise<boolean> { return true; }
  async convert(requests: ParsedRequest[], options: ConvertOptions): Promise<string> {
    return requests.map(req => req.api).join("\n");
  }
}

const apis = await convertRequests("GET /my-index/_search\nGET /\n", new MyExporter(), {});
console.log(apis); // outputs "search\ninfo"
```
