# run

run

```bash
node server.js
```

## call

```bash
curl -H "Content-Type: application/json" \
--request POST \
--data '{"query": "{hello}"}' \
http://localhost:4000/graphql
# {"data":{"hello":"Hello world!"}}


curl -H "Content-Type: application/json" \
--request POST \
--data '{"query": "{rollThreeDice}"}' \
http://localhost:4000/graphql
# {"data":{"rollThreeDice":[6,5,1]}


curl -H "Content-Type: application/json" \
--request POST \
--data '{"query": "{rollDice(dices: $dices, sides: $sides)}", "variables": "{\"dices\": 4, \"sides\":6}"}' \
http://localhost:4000/graphql

curl -H "Content-Type: application/json" \
--request POST \
--data '{"query": "{rollDice(dices: 3, sides: 20)}"}' \
http://localhost:4000/graphql

# on http://localhost:4000/graphql
{
  getDie(numSides: 6) {
    rollOnce
    roll(numRolls: 3)
  }
}
# {
#   "data": {
#     "getDie": {
#       "rollOnce": 5,
#       "roll": [
#         3,
#         2,
#         4
#       ]
#     }
#   }
# }


mutation {
  createMessage(input: {
    author: "andy",
    content: "hope is a good thing",
  }) {
    id
  }
}

mutation {
  updateMessage(id: "56a17d877d9aa3bb21e1", input: {content:"this is content", author: "john doe"}) {
    content
    author
  }
}

query {
  getMessage(id: "56a17d877d9aa3bb21e1") {
    content
    author
  }
}
```



```bash
# On browser console
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({query: "{ hello }"})
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));
```
