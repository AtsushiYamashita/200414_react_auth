import child_process from "child_process"
import _ from "lodash"
import { Dic, Set } from "shorter-dts"

const method = "-X POST"
const type = "Content-Type: application/json"
const qpto = `localhost:8018/`
const apto = (n: number) => `localhost:8018/answer/${n}`

const dataset: Set<Dic, string>[] = [
  [{
    "title": "What is React?",
    "description": "I have been hearing a lot about React. What is it?"
  }, qpto],
  [{
    "title": "How do I make a sandwich?",
    "description": "I am trying very hard, but I do not know how to make a delicious sandwich. Can someone help me?"
  }, qpto],
  [{
    "answer": "Just spread butter on the bread, and that is it."
  }, apto(1)],

]
const to_json = (dic: Dic) => Object
  .entries(dic)
  .map(([k, v]) => `"${k}":"${v}"`)
  .join(",");

const post = (about: Dic, to: string) => [child_process.execSync(
  `curl ${method} -H '${type}' -d '{${to_json(about)}}'  ${to}`
), `curl ${method} -H '${type}' -d '{${to_json(about)}}'  ${to}`];

_.forEach(dataset, ([a, t], i) => {
  /*const cmd =  */ post(a, t).pop();
  console.log("\n >> ", i /*,cmd */)
})

console.log("\n >> done...")
process.exit(0);

