/* eslint-env node */

"use strict";
import * as express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import ErrorHandle from "./ErrorHandle"


interface IQuestion {
    id: number,
    title: string,
    description: string,
}

interface IQA extends IQuestion {
    answer: number,
    answers: string[],
}

class Question implements IQuestion, IQA {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public answers: string[] = [],
    ) { }
    get answer() { return this.answers.length; }
    get summary() {
        const { id, title, description } = this;
        return { id, title, description, answers: this.answer };
    }
}

// database
const questions: Question[] = []

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
        const [parseable, id] = ErrorHandle(
            parseInt, _ => -1, req.params.i);
        if (parseable === false) {
            return res
                .status(404)
                .send({ params: req.params })
        }
        const question = questions
            .filter(q => q.id === id)
        if (question.length > 1) {
            return res
                .status(500)
                .send({ params: question.length })
        }
        res.send(question[0]);
    })

    

}