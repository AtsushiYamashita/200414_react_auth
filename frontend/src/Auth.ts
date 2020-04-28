import auth0 from "auth0-js"
import { Func } from "shorter-dts"
import _ from "lodash"
import Observer from "./Observe"

const AUTH_API_SERVER = "http://localhost:8018/";
const REACT_SERVER = "http://localhost:3000/";



type AuthParsedHash = auth0.Auth0DecodedHash;

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
            .add_call_chain(e => new auth0.WebAuth(e))
            .then(self.auth0.update);


        fetch(
            AUTH_API_SERVER + "authopt2", {
            credentials: 'same-origin'
        }).then(res => res.json().then(option.update))
            .catch(console.error);
        return self;
    }

    private constructor() {
        this.auth0 = new Observer();
        this.option = new Observer();
        this.profile = new Observer();
        this.profile.add_notify(e=>console.log(` Profile`,e))
        this.idToken = new Observer();
        this.expiresAt = -1;

        const ObservedValues = [
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
            // .add_rejector(e => new Date().getTime() < e.exp * 1000)
            .add_notify(([m, v]) => this.expiresAt = v.exp * 1000);

        const methods = [
            this.silentAuth,
            this.signOut,
            this.signIn,
            this.setSession,
            this.self,
            this.isAuthenticated,
            this.handleAuthentication,
            this.getIdToken,
        ];

        const funcs = _(methods)
            .map(e => e as any as Function)
            .filter(_.isFunction)
            .map(e => /*logger<string>("L:136")(e.name) */ e.name)
            .value();
        _.bindAll(this, funcs)
    }

    silentAuth() {
        return new Promise<any[]>((resolve, reject) => {
            this.auth0.add_call_chain(e => e.checkSession({}, (err, token) => {
                if (err) return reject([err]);
                this.setSession(token);
                resolve([]);
            }))
        })
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
        return new Date().getTime() < this.expiresAt
    }

    signIn() {
        if (!this) console.error("this is missing")
        console.log("this....", this)
        const option = this.option.value()[0];
        this.auth0.add_call(e => e.authorize(option));
        return;
    }

    setSession(authResult: AuthParsedHash) {
        const hash = new Observer<AuthParsedHash>();
        hash.add_rejector(e => !e)
            .add_rejector(e => !e.idToken)
            .add_rejector(e => !e.idTokenPayload);

        hash.add_call_chain(e => (e.idToken as string))
            .then(this.idToken.update);

        hash.add_call_chain(e => (e.idTokenPayload as AuthProfile))
            .then(this.profile.update);

        return hash.update(authResult);
    }

    handleAuthentication() {
        const to_hash = (user: auth0.WebAuth) => new Promise<AuthParsedHash>((res, rej) => {
            user.parseHash((err, hash) => !!err ? rej(err) : res(hash as AuthParsedHash));
        })
        const hash_opt = (user: auth0.WebAuth) => _.merge(user, { hash: window.location.hash });

        return new Promise<number[]>((res, rej) => {
            this.auth0.add_call_chain(hash_opt)
                .then(to_hash)
                .then(e => this.setSession(e as AuthParsedHash))
                .then(e => e && res([]))
                .catch(e => rej([102, e]));
        })
    }

    signOut() {
        // clear id token, profile, and expiration
        this.auth0.add_call_chain(e => e)
        .then(e => e.logout({
            returnTo: REACT_SERVER,
            clientID: this.option.value()[0]?.clientID,
        }));
        [this.idToken, this.profile].forEach(e => e.reset());
        this.expiresAt = -1;
    }
}

const auth0Client = Auth.init();
// console.log(auth0Client.self())

export default auth0Client.self();
