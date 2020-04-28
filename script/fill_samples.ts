import child_process from "child_process"
import _ from "lodash"
import { Dic, Set } from "shorter-dts"

console.log("\n >> start...")

// const temp: [number, number, Promise<number>?] = [-1, -1]
// temp[2] = new Promise((res, _) => {
//   temp[1]++;
//   const cb = () => {
//     temp[0] = 0;
//     res(0);
//   }
//   const qi = setInterval(_ => { cb(); clearInterval(qi) }, 200);
// })
// const then = (target: Promise<number>, i: number, func: any) => {
//   console.log("update:", i)
//   target && target.then(e => { console.log("call:", i); func(e); })
// }

// console.log(`
//         current worker_i=${-1}
//         temp[0]=${temp[0]} temp[1]=${!!temp[1]}
//         `);
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,].forEach((_, i) => {
//   const cb = () => {
//     temp[2] = new Promise((res, _) => {
//       temp[1]++;
//       if(!temp[2]) { console.log("temp", temp);}
//       temp[2] && then(temp[2], i, (e: number) => {
//         const cb = () => {
//           console.log(`
//         current worker_i=${i}-${temp[1]}
//         promise_call_from=${e}
//         temp[0]=${temp[0]} temp[1]=${!!temp[1]}
//         `);
//           temp[0] = temp[0] + 1;
//           res(i + 1);
//         };
//         const qi = setInterval(_ => { cb(); clearInterval(qi) }, 200);
//       })
//     });
//     return true
//   }
//   console.log("call at", i, temp[2]);
//   const qi = setInterval(_ => { cb() && clearInterval(qi); }, 100 * i);
// })




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

