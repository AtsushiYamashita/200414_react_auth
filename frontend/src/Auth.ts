import auth0 from "auth0-js"
import { Map, Func, Set, Dic } from "shorter-dts"
import _ from "lodash"
import Observer from "./Observe"

const AUTH_API_SERVER = "http://localhost:8018/";
const REACT_SERVER = "http://localhost:3000/";


const wrap = function <V, N>(s: Func<V, N>) {
    return (a: V) => { s(a); return a; }
}
const logger = <V,>(m: any) => wrap<V,any>(v => console.log(m, v))


type AuthProfile = {
    name: string;
    email: string;
    picture: string;
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
};

class Auth {
    private option: Observer<auth0.AuthOptions>;
    private auth0: Observer<auth0.WebAuth>;
    private profile: Observer<AuthProfile>;
    private idToken: Observer<string>;
    private expiresAt: number;

    static init(): Auth {
        const self = new Auth();
        const option = new Observer<auth0.AuthOptions>();
        option.add_rejector(_.isNull)
            .add_rejector(_.isUndefined);
        option.add_call_chain(self.option.update);
        // option.add_call(logger("L:83 "));
        self.option
            // .add_call(logger<auth0.AuthOptions>("L:86"))
            .add_call_chain(e=>new auth0.WebAuth(e))
            .then(self.auth0.update);

        fetch(
            AUTH_API_SERVER + "authopt2", {
            credentials: 'same-origin'
        }).then(res => res.json().then(option.update))
            .catch(console.error);
        console.log("serlf is", self)
        return self;
    }

    private constructor() {
        this.auth0 = new Observer();
        this.option = new Observer();
        this.profile = new Observer();
        this.idToken = new Observer();
        this.expiresAt = -1;

        this.auth0.add_notify(logger("L:118"));
        const ObservedValues =         [
            this.auth0,
            this.option,
            this.profile,
            this.idToken,
        ];
        ObservedValues.forEach(e => e
            .add_rejector(_.isNull)
            .add_rejector(_.isUndefined)
        );
        this.idToken.add_rejector(_.isString);
        this.profile
            .add_rejector(e => new Date().getTime() < e.exp * 1000)
            .add_notify(([m, v]) => this.expiresAt = v.exp * 1000);

        const methods = [
            this.self,
            this.getIdToken,
            this.handleAuthentication,
            this.isAuthenticated,
            this.self,
            this.signIn,
            this.signOut
        ];

        const funcs = _(methods)
            .map(e => e as any as Function)
            .filter(_.isFunction)
            .map(e => /*logger<string>("L:136")(e.name) */ e.name )
            .value();
        _.bindAll(this, funcs)
    }
    self() {
        return this;
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    isAuthenticated(): boolean {
        // return new Date().getTime() < this.expiresAt;
        return _([this.expiresAt])
            .map(e => new Date().getTime() < e)
            .filter()
            .toLength() > 0;
    }

    signIn() {
        if (!this) console.error("this is missing")
        console.log("this....", this)
        const option = this.option.value()[0];
        this.auth0.add_call(e => e.authorize(option));
        return;
    }

    handleAuthentication() {
        console.log("---- handler");
        type Hash = auth0.Auth0DecodedHash;
        const hash = new Observer<Hash>();
        hash.add_rejector(e => !!e)
            .add_rejector(e => !!e.idToken)
            .add_rejector(e => !!e.idTokenPayload);
        hash.add_call(e => this.idToken.push(["", e.idToken as string]))
            .add_call(e => this.profile.push(["", e.idTokenPayload as AuthProfile]));

        const to_hash = (user: auth0.WebAuth) => new Promise<Hash>((res, rej) => {
            console.log("user ---",user);
            user.parseHash((err, hash) => logger(`eee = ${err} ${JSON.stringify(err)} \nhash=${hash}`)([{err,hash}]) &&  err && rej(err) || res(hash as Hash));
            // sub(console.log,console.log)("tohash");
        })
        const hash_opt = (user:auth0.WebAuth) => _.merge(user, { hash: window.location.hash });

        return new Promise<number[]>((res, rej) => {
            this.auth0
                .add_call_chain(hash_opt)
                .then(to_hash)
                .then(logger("L:187"))
                .then(e=>hash.update(e) && e || logger("L:188")(e)  )
                .then(e=>e && res([]))
                .catch(e=>rej([102,e]));
                // .add_call(user => _.chain(user))//to_hash(hash_opt())
                //     .then(e => [console.log("L 192 >>", e)] && hash.push(["", e]))
                //     .then(e => e ? res([]) : rej([1000]))
                //     .catch(e => rej([1002, e]))
                // );
            // const user = _.chain(this.auth0).head().value();
            // sleep(100, _ => param(res, rej), (n) => console.log("loop", n) || !!this.auth0[0]);
        })
    }

    signOut() {
        // clear id token, profile, and expiration
        [this.idToken, this.profile].forEach(e => e.reset());
        this.expiresAt = -1;
    }
}

const auth0Client = Auth.init();
console.log(auth0Client.self())
export default auth0Client.self();
