import { Func, Set } from "shorter-dts"

export default function ErrorHandle<A, R>(
    tryf: Func<A, R>,
    deff: Func<[any, A], R>,
    val: A): Set<boolean, R> {
    try {
        return [true, tryf(val)];
    } catch (e) {
        return [false, deff([e, val])];
    }
}
