# Ollama + Jupyter OOD Application for PACE at Georgia Tech

## Introduction

This document describes how to use PACE's Ollama + Jupyter application, which is
available via Open OnDemand (OOD) for ICE.   The OOD app starts a Ollama server
on the backend and provides a Jupyter session on the frontend.  Through the
Jupyter session, you can interact with the Ollama backend via Python APIs.  This
is intended for developing API-driven applications.

In this document, we give examples for:

* *The Ollama API:*  This can be used for requesting chat completions, importing
  and downloading models, quantizing models, and other tasks supported by
  Ollama.  

* *The OpenAI API:*  Ollama offers compatibility with the
  OpenAI API.  This allows you to integrate Ollama with a wide variety of downstream 
  applications and frameworks, such as frameworks for creating and managing agents.

* *Using Python `requests`:*  Some workflows may involve raw REST API calls using `curl`.  
  These can be accomplished in a robust, Python-native manner using the `requests` library, which is ubiquitous in Python web applications.

## The Ollama API

Here, we demonstrate the [Ollama Python
API](https://github.com/ollama/ollama-python), which is a wrapper around the
the [Ollama REST API](https://github.com/ollama/ollama/blob/main/docs/api.md).
The Python API available when you select the "Default" Python Environment in the
OOD webform.  It can also be installed in your own Python environments and
containers
([link](https://github.com/ollama/ollama-python?tab=readme-ov-file#install))

## Module import

In the Jupyter session, first import the `ollama` module.  

``` Python
import ollama
```

### Listing models

If you selected "PACE shared models" in the "Ollama models directory" dropdown on the OOD webform, you can use several models that are already downloaded.  You can use `ollama.list().models` to list the downloaded models.  This will return a `list` of models with useful metadata, such as info about size and quantization.  For a more human-readible list of models, you can run:

```
for m in ollama.list().models:
    print(m.model)
```

At the time writing, the PACE shared models includes:

* `llama3.3:70b`
* `llama3.2:3b`
* `llama3.2:1b`
* `llama3.1:8b`
* `phi4:14b`
* `smollm2:1.7b`
* `smollm2:360m`
* `smollm2:135m`

### Downloading and deleting models 

If you selected "Temporary directory" or a writable "Custom directory" in the "Ollama
models directory" dropdown, you can download additional
models from the [Ollama library](https://ollama.com/library).  To download a new model, use `ollama.pull`:

``` Python
ollama.pull('granite3.1-dense:2b')
```

To delete a previously-downloaded model, use `ollama.delete`.  
    
``` Python
ollama.delete('granite3.1-dense:2b')
```

Both these commands will fail with a "permission denied" error if you use "PACE shared models" or another directory that is not writable by you.

### Generating a chat response

Using the Ollama API, there are several way to request and receive chat responses.  Below is an example using `ollama.chat`.  The `model` parameter is the name of a model that you previously downloaded.  

``` Python
response = ollama.chat(
    model='smollm2:135m', 
    messages=[
        {
            'role': 'user',
            'content': 'Hello!  How are you today?'
        }
    ]
)

print(response.message.content)
```

## The OpenAI API:

Ollama supports the OpenAI API.  This opens up Ollama to a wide range of integrations with downstream apps and frameworks.  The Ollama blog demonstrates integrations with Vercel and Autogen ([link](https://ollama.com/blog/openai-compatibility)).  Detailed info about OpenAI compatibility is available in the Ollama docs ([link](https://github.com/ollama/ollama/blob/main/docs/openai.md)).

Here, we demonstrate the `openai` Python API.  This is available in the "Default" Python environment from the OOD app.  It
can also be installed in your own environment or container ([link](https://pypi.org/project/openai/)).

When using the OpenAI API, you must specify the hostname and port for the
currently-running Ollama backend server.  This differs from the `ollama` Python module, which is able to
infer the hostname and port.  For the OpenAI APIs and other APIs, the Ollama server's hostname/port can be
queried via the `OLLAMA_HOST` environment variable.  

In Python, you can query `OLLAMA_HOST` using the `os.environ` module.  **Note that the port will differ in each OOD session, so make sure you query `OLLAMA_HOST` in each session instead of relying on a hardcoded value from a previous session.**.  

``` Python
import os
os.environ['OLLAMA_HOST']
```

Now we can generate completions.  First, we instantiate a client, using `OLLAMA_HOST` as part of the
 `base_url`.  With that client, we can perform completions and other tasks via the OpenAI API.  

``` Python
from openai import OpenAI

client = OpenAI(
    base_url = f'http://{os.environ['OLLAMA_HOST']}/v1',
    api_key='ollama', # required, but unused
)

response = client.chat.completions.create(
  model="smollm2:135m",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {"role": "assistant", "content": "The LA Dodgers won in 2020."},
    {"role": "user", "content": "Where was it played?"}
  ]
)

print(response.choices[0].message.content)
```

## Using `requests`

Finally, we will demonstrate how to make REST API calls using the Python
`requests` module.  This is useful if you need a capability from the REST
API that is not exposed in the Python API.  It is also useful for lower-level
application development where you need to pass requests between several
services.  

Here, we show how to use the OpenAI REST API.  As in the `openai` Pyton module,
we must query hostname/port of the ollama server using the `OLLAMA_HOST`
environment variable.  This is used as a component of the `url`, which is passed
to `request.post`.  The return value of `request.post` is JSON formatted.  

``` Python
import requests

url = f'http://{os.environ['OLLAMA_HOST']}/v1/completions'
headers = {"Authorization": f"Bearer ollama"}
data = {
    "model": "smollm2:135m",
    "prompt": "Are you alive?"
}

print(requests.post(url, headers=headers, json=data).json())
```
