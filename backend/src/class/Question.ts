
export interface IAuthor {
    name: string
}

export interface IQuestion {
    id: number,
    title: string,
    description: string,
}

export interface IAnswer {
    answer: string,
    author: IAuthor
}

export interface IQA extends IQuestion {
    answer: number,
    answers: IAnswer[],
}

export class Question implements IQuestion, IQA {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public author: IAuthor,
        public answers: IAnswer[] = [],
    ) { }
    get answer() { return this.answers.length; }
    get summary() {
        const { id, title, description } = this;
        return { id, title, description, answers: this.answer };
    }
}

export default Question;
