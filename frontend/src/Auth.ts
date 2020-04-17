import auth0 from "auth0-js"

declare const AUTH_API_SERVER = "http://localhost:8018/";
declare const REACT_SERVER = "http://localhost:3000/";

declare namespace Prominify {
    export type Reject<E> = (reason?: E) => void;
    export type Resolve<R> = (ret: R) => void;
    export interface Done<R, E> {
        resolve: Resolve<R>;
        reject: Reject<E>;
    }
}

function prominify<E, R, K extends keyof R,Res>(
    def:Res,
    done: Prominify.Done<Res, E>,
    act: { [N in keyof R]: ((v: R[N]) => string) },
    err?: E | null, res?: R | null
) {
    if (!!err) return done.reject(err);
    if (!res) return done.reject();
    const keys = Object.keys(res) as K[]
    const val = keys
        .map((key: K): [K, R[K]] => [key, res[key]])
        .filter(e => !!e[1]) || [];
    const miss = val.length < keys.length
    if (miss) return done.reject();
    const acted = keys
        .map<[K, string]>((e: K) => [e, act[e] && act[e](res[e]) || "FAIL"])
        .filter(e => e[1].length > 1) || [];
    if (acted.length > 1) return done.reject();
    return done.resolve(def);
}


class Auth {
    private auth0: [auth0.WebAuth?, Promise<auth0.WebAuth>?]
    private profile?: any;
    private idToken?: string;
    private expiresAt: number;
    private waiting: ((s: Worker) => Worker)[];

    static init() {
        return new Auth();
    }

    constructor() {
        this.auth0 = []
        const placeholder = new Promise<auth0.WebAuth>((resolve, reject) => {
            const make_auther = (json: any) => {
                const auth = new auth0.WebAuth(json);
                this.auth0[0] = auth;
                resolve(auth);
            }
            const to_json = (res: Response) => {
                res.json()
                    .then(make_auther)
                    .catch(reject)
            }
            fetch(
                AUTH_API_SERVER + "auth-option", {
                credentials: 'same-origin'
            })
                .then(to_json)
                .catch(reject)
        })
        this.auth0[1] = placeholder;

        this.expiresAt = -1;
        this.waiting = [];

        this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated() {
        return new Date().getTime() < this.expiresAt;
    }

    signIn() {
        this.auth0[1] = new Promise((resolve, reject) => {
            this.auth0[1] && this.auth0[1]
                .then(e => { e.authorize(); resolve(e); })
                .catch(reject)
        })
    }

    handleAuthentication() {
        if(!this.auth0[1])  throw new Error(">> Auth error") ;
        this.auth0[1].then(auth=>{
            this.auth0[1] = new Promise((resolve, reject) => {
                if(!this.auth0[0])throw new Error(">> Auth error");
                this.auth0[0].parseHash((e, a) => prominify(auth,{ resolve, reject }, {
                    idToken: (v: string | undefined) => { this.idToken = v; return ""; },
                    idTokenPayload: (v: any) => { this.profile = v; this.expiresAt = v.exp * 1000; return ""; },
                }, e, a));
                resolve(auth)
            })
        })
    }

    signOut() {
        // clear id token, profile, and expiration
        this.idToken = undefined;
        this.profile = undefined;
        this.expiresAt = -1;
    }
}

const auth0Client = Auth.init();

export default auth0Client;
