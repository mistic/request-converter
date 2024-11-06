import {
  convertRequests,
} from "../src/convert";

const devConsoleScript = `
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "test-bulk",
        "alias": "my-alias-bulk"
      }
    }
  ]
}

GET /_alias/my-alias-bulk,test2


PUT _connector/my-connector
{
  "index_name": "search-google-drive",
  "name": "My Connector",
  "service_type": "google_drive"
}

GET _connector/my-connector

PUT _ingest/pipeline/pipelineA
{
  "description" : "...",
  "processors" : [
    {
      "community_id": {
        "source_ip": "a",
        "seed": 1
      }
    }
  ]
}



POST /test-bulk/_async_search?size=0
{
  "sort": [
    { "date": { "order": "asc" } }
  ],
  "aggs": {
    "sale_date": {
      "date_histogram": {
        "field": "date",
        "calendar_interval": "1d"
      }
    }
  },
  "suggest": {
    "YOUR_SUGGESTION": {
      "text": "b",
      "term": {
        "field": "MESSAGE",
        "options": {
          "text": ["a","b"],
          "score": 2,
          "freq": 2,
          "highlighted": "e",
          "collate_match": true
        }
      }
    }
  }
}


DELETE my-data-stream/_alias/my-alias

PUT my-data-stream/_alias/my-alias

POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "test-bulkk",
        "alias": "my-alias"
      }
    }
  ]
}

POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "my-data-stream",
        "alias": "my-alias"
      },
      "remove_index": {
        "index": "aaa"
      }
    }
  ]
}

GET _ml/trained_models/my-elser-model

GET _ml/trained_models/

PUT _inference/sparse_embedding/my-elser-model
{
  "service": "elser",
  "service_settings": {
    "num_allocations": 1,
    "num_threads": 1
  },
  "task_settings": {}
}

GET _inference/_all

POST _inference/sparse_embedding/my-elser-model
{
  "input": "The sky above the port was the color of television tuned to a dead channel.",
  "task_settings": {
    "input_type": "ingest"
  }
}

DELETE _inference/my-elser-model


GET test-bulk/_search
{
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "boost": "5",
      "random_score": {}, 
      "boost_mode": "multiply"
    }
  }
}

DELETE test-bulk


GET _xpack/

PUT _index_template/template_1
{
  "data_stream": {
    "allow_custom_routing": false,
    "hidden": false
  }, 
  "index_patterns": ["te*", "bar*"],
  "template": {
    "settings": {
      "number_of_shards": 1
    },
    "mappings": {
      "_source": {
        "enabled": true
      },
      "properties": {
        "host_name": {
          "type": "keyword"
        },
        "created_at": {
          "type": "date"
        }
      }
    },
    "aliases": {
      "mydata": { }
    }
  },
  "priority": 500,
  "composed_of": ["component_template1", "runtime_component_template"], 
  "version": 3,
  "_meta": {
    "description": "my custom"
  }
}

PUT _scripts/my-stored-script2
{
  "script": {
    "lang": "painless",
    "source": "Math.log(_score * 2) + params['my_modifier']"
  }
}

GET /_search
{
  "size": 0,
  "aggs": {
    "my_buckets": {
      "composite": {
        "sources": 
          { "product": { "terms": { "field": "product" } } }
        
      }
    }
  }
}

GET my-index-000001/_search?size=0&track_total_hits=false
{
  "aggregations": {
    "sampling": {
      "random_sampler": {
        "seed" : 1,
        "shard_seed" : 2,
        "probability": 0.1
      },
      "aggs": {
        "price_percentiles": {
          "percentiles": {
            "field": "taxful_total_price"
          }
        }
      }
    }
  }
}

POST my-index-000001/_update_by_query?conflicts=proceed&wait_for_completion=false
{
  "query": { 
    "term": {
      "user.id": "kimchy"
    }
  }
}


PUT image-index
{
  "mappings": {
    "properties": {
      "image-vector": {
        "type": "dense_vector",
        "dims": 3,
        "similarity": "l2_norm"
      },
      "title-vector": {
        "type": "dense_vector",
        "dims": 5,
        "similarity": "l2_norm"
      },
      "title": {
        "type": "text"
      },
      "file-type": {
        "type": "keyword"
      }
    }
  }
}

POST image-index/_search
{
  "profile": true, 
  "knn": {
    "field": "image-vector",
    "query_vector": [-5, 9, -12],
    "k": 10,
    "num_candidates": 100
  },
  "fields": [ "title", "file-type" ]
}

GET my-corrupted-index-2/_settings

PUT my-corrupted-index-4
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom", 
          "tokenizer": "standard",
          "char_filter": [
            "html_strip"
          ],
          "filter": [
            "lowercase",
            "asciifolding"
          ],
          "another" : "{{}}",
          "yeah," : "ś̶̡̧̧̧̨͔̬͓̣̲̬̤͙̫̪̼͖̮͚̬̘̟̥̞̗̙͉̙̩͚̂́͐̚̕ͅo̷̧̗̤̤̣̳̜͉̠͚̞̫̗̗͙͕̲̦̼̲̯̬͓̹̫͋̈́́͋͊͂̑͆͋͐̍͂͂̒̾̽̈̓̿̊̈́͑̌͗̇͊͐̊̽͐́̕̚̕͘̕̚͠͝͝͝ͅͅ ̷̡̛̻̙̲̦̗̞̾̂̍͗͑͐͌̅̏̔̿͋̄́́̋̈́͘͜͝͝ṉ̷̛̛̩̖̺͈̪͉̝́͊̍͐̊͋̎͑̀̏̎͋̔͆̏̉͐̀͊͒̈́͊̈́͂̆̇͗̓͗̾̽̃̿̿̃̐̾͂́̕̕͘͝͠͠͝i̷̧̡̨̨͖͇̣͖̩̭̯̣͓̮̗͙̥̼̪̭͓͉̟̦̳̳̩̟̳̖̭͛̊̾͑̔͌̓̒͌̈́̏͋̌̏͂̔̾̅́̈́̽̉́̄͊͗͜͝ͅͅç̵̢͔̣̥̗͈̱̭̐̀͌̾̈́̐̒͗͛̍̃̊̅̾͛͑̉͑̔͊͠͝͠ȇ̸̡̢̤͎̳̺͓̟̪̭̤̱͉̹͉͓̣̲͎̫̬͔̟̹͔̯̉̾̓́͗̐̔͌͛̏̚ ̶̨̨̨̨̨̛̞͙̟̱̜͕͔̠̮̹̫̭͉͙̪̟̯̳̤̝̪͖̞̳͕͈̣̬̬̤͍̟̞͗̀́̿͊́͗̅͛̽͗̈͋̉̅̏̐͌͛̌̕͠ͅi̵̢̧̹̩̤̯̭̱̹͚̦̺̜͚̺͎͓̣̰̞̲̙̻̹̭̤̦̘̮͓̞̲̗̬̟͚̓͌̀̄̏̐̉̆̆̀̂̌͗̇́̐͐͗̉̐͌̈́̈̈́́͊͘͝͠ͅs̵̡̢͈̦̤͙͍̤̗͍̗̲̮͔̤̻̹̞̠̠͙̠͂̊̅̃̾͒̓̂̿̊͊͊͜n̸̩̬͍͓͇̰̼͇̦̬͔̰̭͙̦̥̈̓̆̍̅́͐̾͝͠'̵̧͕̳̻̺̻͖͓̖͔̣͇͈̄̒̑ẗ̴̨̹̮͉͕̖̩͔̰͉͓̙̖͉́͛̾͛̐̏ ̵̧̨̛͚͈̲͔̯͕͚̞̲̗̣̱̘̻͚̺͇̣͇͓̭̲͈̪̗̯̘̦̳̫̥̳̜͍̰̝̣̭̗͔̥̊̿̈́́̑̇̽̄͂͋͆̀̃͑̉͗͂͆̐̈̾͗̕͘͜͝͝͝ͅį̴̨̨̨̡̧̖͍͙͕̝͈͓̟̮̹̥̫̻̰̤̱͓̮͉͓̲̻͇̬͓̺̩̗͔̲͔̣̦̤̝͍͔͖̻͈͓̒̇͋̇̐̃̒͗̽̂́́͑͛̐͗̔̋͒̅̕͝͝͠ͅͅţ̵̢̧̡̡̱̘͓̱̲͕̝̟͎͖̗̣̘̟̳̟̰͙̪͕̟̥͔̯̟̯̼̺̝̤̖̟̹̭̘̙̮̪͇̆͗͑́̀͘͜",
          "anything" : "𝙩٥ʈấɫḽұ ứ𝓽𝑓-8"
        }
      }
    }
  }
}

GET /_analyze
{
  "tokenizer": "whitespace",
  "filter": [
    {
      "type": "pattern_replace",
      "pattern": "(dog)",
      "replacement": "watch$1",
      "anything" : "𝙩٥ʈấɫḽұ ứ𝓽𝑓-8"
    }
  ],
  "text": "foxes jump lazy dogs"
}


PUT _ilm/policy/my_policy
{
  "policy": {
    "_meta": {
      "description": "used for nginx log",
      "project": {
        "name": "myProject",
        "department": "myDepartment"
      }
    },
    "phases": {
      "warm": {
        "min_age": "10d",
        "actions": {
          "forcemerge": {
            "max_num_segments": 1
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}

PUT my-index-000012/_doc/1
{
  "doc": "1"
}

PUT my-index-000012/_settings
{
  "index.lifecycle.name": "my_policy"
}



POST _ilm/move/my-index-000012
{
  "current_step": { 
    "phase": "new",
    "action": "complete",
    "name": "complete"
  },
  "next_step": { 
    "phase": "warm"
  }
}

POST /my-index-000001/_forcemerge?wait_for_completion=false

PUT /job-candidates
{
  "mappings": {
    "properties": {
      "name": {
        "type": "keyword"
      },
      "programming_languages": {
        "type": "keyword"
      },
      "required_matches": {
        "type": "long"
      }
    }
  }
}

PUT /job-candidates/_doc/1?refresh
{
  "name": "Jane Smith",
  "programming_languages": [ "c++", "java" ],
  "required_matches": 2
}

PUT /job-candidates/_doc/2?refresh
{
  "name": "Jason Response",
  "programming_languages": [ "java", "php" ],
  "required_matches": 2
}


GET /job-candidates/_search
{
  "query": {
    "terms_set": {
      "programming_languages": {
        "terms": [2,3,4],
        "minimum_should_match_field": "required_matches"
      }
    }
  }
}


POST quantized-image-index/_search
{
  "knn": {
    "field": "image-vector",
    "query_vector": [0.1, -2],
    "k": 15,
    "num_candidates": 100
  },
  "fields": [ "title" ],
  "rescore": {
    "window_size": 10,
    "query": {
      "rescore_query": {
        "script_score": {
          "query": {
            "match_all": {}
          },
          "script": {
            "source": "cosineSimilarity(params.query_vector, 'image-vector') + 1.0",
            "params": {
              "query_vector": [0.1, -2]
            }
          }
        }
      }
    }
  }
}








GET my-index-000001/_search?size=2
{
  "query": {
    "term": {
      "user.id": {
        "value": "kimchy"
      }
    }
  }
}





GET /drivers/_search
{
  "query": {
    "nested": {
      "path": "driver",
      "query": {
        "nested": {
          "path": "driver.vehicle",
          "query": {
            "nested": {
              "path": "driver.vehicle.wheel",
              "query": {
                "nested": {
                  "path": "driver.vehicle.wheel.nut",
                  "query": {
                    "nested": {
                      "path": "driver.vehicle.wheel.nut.metal",
                      "query": {
                        "nested": {
                          "path": "driver.vehicle.wheel.nut.metal.atom",
                          "query": {
                            "match_all": {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

GET /_nodes/stats

PUT music
{
  "mappings": {
    "properties": {
      "suggest": {
        "type": "completion"
      }
    }
  }
}

PUT music/_doc/1?refresh
{
  "suggest" : {
    "input": [ "Nevermind", "Nirvana" ],
    "weight" : 34
  }
}

POST music/_search
{
  "suggest": {
    "song-suggest": {
      "prefix": "nir",        
      "completion": {         
          "field": "suggest"  
      }
    }
  }
}

GET _cat/indices
GET llama-test/_mapping

GET article-test-oapi-last/_mapping

GET article-test-oapi-last/_search


GET llama-test-2/_mapping

GET my-index-00004/_settings

PUT my-index-00005
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "my_tokenizer"
        }
      },
      "tokenizer": {
        "my_tokenizer": {
          "type": "PathHierarchy"
        }
      }
    }
  }
}


PUT animals/_mappings
{
  "runtime": {
    "http": {
      "type": "composite",
      "name": "a",
      "script": "emit(grok(\\"%{COMMONAPACHELOG}\\").extract(doc[\\"message\\"].value))",
      "fields": {
        "clientip": {
          "type": "ip"
        },
        "verb": {
          "type": "keyword"
        },
        "response": {
          "type": "long"
        }
      }
    }
  }
}

PUT _ingest/pipeline/user_agent
{
  "description" : "Add user agent information",
  "processors" : [
    {
      "user_agent" : {
        "field" : "agent"
      }
    }
  ]
}

GET /

POST /animals/_pit?keep_alive=1m

POST /_ingest/pipeline/my-pipeline/_simulate?verbose
{
  "_source":         {"my-boolean-field": false},
  "something":" dd",
  "docs": [
    {
      "_index": "index",
      "_id": "id",
      "_source": {
        "my-keyword-field": "bar"
      }
    },
    {
      "_index": "index",
      "_id": "id",
      "_source": {
        "my-long-field": 10
      }
    }
  ]
}

PUT _ingest/pipeline/my-pipeline
{
  "description": "My optional pipeline description",
  "processors": [
    {
      "set": {
        "description": "My optional processor description",
        "field": "my-long-field",
        "value": 10
      }
    },
    {
      "set": {
        "description": "Set 'my-boolean-field' to true",
        "field": "my-boolean-field",
        "value": true
      }
    },
    {
      "lowercase": {
        "field": "my-keyword-field"
      }
    }
  ]
}

POST /_scripts/painless/_execute
{
  "script": {
    "source": "doc['field'].value.length() <= params.max_length",
    "params": {
      "max_length": 4
    }
  },
  "context": "filter",
  "context_setup": {
    "index": "arabic_example"

  }
}

POST my-index-000001/_search
{
  "query" : {
    "match": {
      "message": "tring out Elasticsearch"
    }
  },
"suggest": {
        "0": {
            "term": {
                "analyzer": "term_search_analyzer",
                "field": "term",
                "prefix_length": 2,
                "size": 10,
                "sort": "score",
                "lowercase_terms": false
            }
        }
    }
}

POST _analyze
{
  "analyzer": "standard",
  "text": "The 2 QUICK Brown-Foxes jumped over the lazy dog's bone."
}

POST _analyze
{
  "analyzer": "arabic",
  "text": "The 2 QUICK Brown-Foxes jumped over the lazy dog's bone."
}

PUT /arabic_example
{
  "settings": {
    "analysis": {
      "filter": {
        "arabic_stop": {
          "type":       "stop",
          "stopwords":  "_arabic_" 
        },
        "arabic_keywords": {
          "type":       "keyword_marker",
          "keywords":   ["مثال"] 
        },
        "arabic_stemmer": {
          "type":       "stemmer",
          "language":   "arabic"
        }
      },
      "analyzer": {
        "rebuilt_arabic": {
          "tokenizer":  "standard",
          "filter": [
            "lowercase",
            "decimal_digit",
            "arabic_stop",
            "arabic_normalization",
            "arabic_keywords",
            "arabic_stemmer"
          ]
        }
      }
    }
  }
}


GET /_search
{
  "query": {
    "match": { "content": "kimchy" }
  },
  "highlight": {
    "fields": {
      "content": {
        "fragment_offset": 1,
        "matched_fields": "field",
        "analyzer": "a"
      }
    }
  }
}

GET animals/_stats


GET animals/_search
{
  "query": {
    "range": {
      "day": {
        "boost": 1,
        "relation": "contains",
        "gte": "20-06-24",
        "lte": "20-07-24",
        "format": "some-format"
      },
              "time_zone": "+01:00"

    }
  }
}



GET /animals/_search
{
  "version": true,
  "size": 20, 
  "query": {
    "bool": {
      "filter": {
        "terms": {
          "tags.keyword": [
            "Monkey",
            "Lion"
          ]
        }
      }
    }
  }
}

GET /animals/_search
{
      "query": {
        "bool": {
          "filter":
            {
              "term": {
                "tags.keyword": "Monkey"
              }
            }
        }
      }
}

POST /animals/_search
{
  "size": 10,
  "query": {
    "function_score": {
      "query": {
        "bool": {
          "filter": [
            {
              "terms": {
                "tags.keyword": ["Monkey", "Lion"]
              }
            }
          ]
        }
      },
      "functions": [
        {
          "filter": {
            "term": {
              "mustHaveTags.keyword": {"value": "Monkey"}
            }
          },
          "weight": 1
        }],
      "score_mode": "sum",
      "boost_mode": "sum"
    }
  }
}

POST /animals/_search
{
  "size": 10,
  "query": {
    "function_score": {
      "query": {
        "bool": {
          "filter": [
            {
              "terms": {
                "tags.keyword": ["Monkey", "Lion"]
              }
            }
          ]
        }
      },
      "functions": [
        {
          "filter": {
            "term": {
              "mustHaveTags.keyword": {"value": "Monkey"}
            }
          },
          "weight": 1
        },
        {
          "filter": {
            "term": {
              "mustHaveTags.keyword": {"value": "Lion"}
            }
          },
          "weight": 1
        }
      ],
      "score_mode": "sum",
      "boost_mode": "sum"
    }
  }
}

POST /animals/_doc/1
{
  "tags": ["Monkey"],
  "mustHaveTags": ["Lion", "Monkey"]
}

POST /animals/_doc/2
{
  "tags": ["Lion"],
  "mustHaveTags": "Lion"
}

POST /animals/_doc/4
{
  "tags": ["Lion", "Monkey"],
  "mustHaveTags": ["Lion", "Monkey"]
}

POST /animals/_doc/6
{
  "tags": ["Monkey", "Lion"],
  "mustHaveTags": ["Lion", "Monkey"]
}

POST /animals/_doc/7
{
  "tags": "Monkey",
  "mustHaveTags": ["Lion", "Monkey"]
}

DELETE animals

POST /animals/_search

GET /animals/_mapping
`;


it("converts to java as a complete class", async () => {
  expect(await convertRequests(devConsoleScript, "java", { complete: true })).toEqual(
    `
`,
  );
},100000);
