/* eslint-env node */

"use strict";
import * as express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { Func, Set } from "shorter-dts"
import ErrorHandle from "./ErrorHandle"




interface IQuestion {
    id: number,
    title: string,
    description: string,
}
interface IAnswer {
    answer: string,
}

interface IQA extends IQuestion {
    answer: number,
    answers: IAnswer[],
}

class Question implements IQuestion, IQA {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public answers: IAnswer[] = [],
    ) { }
    get answer() { return this.answers.length; }
    get summary() {
        const { id, title, description } = this;
        return { id, title, description, answers: this.answer };
    }
}

// database
const questions: Question[] = []

const parse_id = (params: { id?: string }) => ErrorHandle(
    parseInt, _ => -1, params.id || "");

const get_question = (id: number): Set<number, Question | undefined> => {
    if (id < 0) return [404, undefined]
    const question = questions.filter(q => q.id === id)
    return question.length > 1 && [500, undefined] || [200, question[0]]
}

function start_server() {
    const app = express.default();
    app.use(helmet());
    app.use(bodyparser.json());
    app.use(cors());

    // Log http requests
    app.use(morgan('combined'));

    // retrieve all questions
    app.get('/', (req, res) => {
        const qs = questions.map(q => q.summary)
        res.send(qs);
    })


    app.get("/:id", (req, res) => {
        const [parseable, id] = parse_id(req.params);
        const [status, qt] = get_question(parseable && id || -1);
        console.log(">> 73", status, qt);
        return res.status(status).send(qt);
    })

    app.post("/", (req, res) => {
        console.log(">> 78", req.body);
        const { title, description } = req.body;
        const question = new Question(
            questions.length + 1,
            title, description);
        console.log(">> 82", question)
        questions.push(question);
        res.status(200).send();
    })

    app.post("/answer/:id", (req, res) => {
        const { answer } = req.body;
        const [parseable, id] = parse_id(req.params);
        const [status, qt] = get_question(parseable && id || -1);
        if (status !== 200 || !qt) return res.status(status).send(qt);
        qt.answers.push({ answer });
        console.log(">> 93", qt)
        res.status(200).send();
    })
    const PORT = process.env.PORT || 8018

    app.listen(PORT, () => {
        console.log("listening on http://localhost:" + PORT)
    })
    process.on("SIGINT", () => {
        console.log("server close SIGINT@" + PORT)
        process.exit(0);
    })
}

start_server();
