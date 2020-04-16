/* eslint-env node */

"use strict";
import * as express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "express-jwt"
import jwksRsa from "jwks-rsa"
import { resolve } from "path"
import _ from "lodash"
import { config } from "dotenv"

import Question from "./class/Question"
import { Func, Set } from "shorter-dts"
import ErrorHandle from "./ErrorHandle"


config({ path: resolve(__dirname, "../.env") })
const {
    AUTH0_DOMAIN,
    AUTH0_CLIENT_ID,
    PROTOCOL,
    LISTEN_PORT,
    LOAD
} = process.env;

const PORT = process.env.PORT || LISTEN_PORT || 8018
if(!LOAD || LOAD !== "localhost".toUpperCase()) throw new Error("Faild to load .env file");

const check_jwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${PROTOCOL}://${AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: AUTH0_CLIENT_ID,
    issuer: `${PROTOCOL}://${AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
})

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
    type Request = express.Request;
    type Response = express.Response;

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

    /**
     * insert a new question
     */
    function insert_new_question(req: Request, res: Response) {
        console.log(">> 78", req.body);
        const { title, description } = req.body;
        const auther = { name: _.get(req, "user.name", "") }
        const question = new Question(
            questions.length + 1,
            title, description, auther);
        console.log(">> 82", question)
        questions.push(question);
        res.status(200).send();
    }
    app.post("/",check_jwt,  insert_new_question)

    function insert_new_answer(req: Request, res: Response){
        const { answer } = req.body;
        const [parseable, id] = parse_id(req.params);
        const [status, qt] = get_question(parseable && id || -1);
        if (status !== 200 || !qt) return res.status(status).send(qt);
        const author = { name: _.get(req, "user.name", "") }
        qt.answers.push({ answer, author });
        console.log(">> 93", qt)
        res.status(200).send();
    }
    app.post("/answer/:id",check_jwt,  insert_new_answer)


    app.listen(PORT, () => {
        console.log("listening on http://localhost:" + PORT)
    })
    process.on("SIGINT", () => {
        console.log("server close SIGINT@" + PORT)
        process.exit(0);
    })
}

start_server();
