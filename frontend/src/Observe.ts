import { Func, Set } from "shorter-dts"
import _ from "lodash"

type Pack<V> = Set<string, V>
type Notify<V> = Func<Pack<V>, void>;
type Validater<V> = Func<Pack<V>, boolean>;
type Rejector<V> = Func<V, boolean>;
type Apply<V> = Func<V, void>;
type Chain<V,R> = Func<V, R>;

interface IObserver<V> {
   add_call(f: Apply<V>): IObserver<V>;
   add_call_chain<R>(f: Chain<V,R>):  Promise<R>;
   add_notify(f: Notify<V>): IObserver<V>;
   add_rejector(f: Rejector<V>): IObserver<V>;
   add_validater(f: Validater<V>): IObserver<V>;
   is_null(): boolean;
   push(pack: Pack<V>): boolean;
   update(v: V): boolean;
   value(): V[];
};


class Observer<V> implements IObserver<V>{
   private observed: Pack<V>[];
   private validater: Validater<V>[];
   private notify: Notify<V>[];
   private call: Apply<V>[];
   private first_value: V[];

   constructor(v?: V, private length: number = 1) {
      this.observed = v ? [["init", v]] : [];
      this.notify = [];
      this.validater = [];
      this.call = [];
      this.first_value = [];


      this.add_call = this.add_call.bind(this);
      this.add_notify = this.add_notify.bind(this);
      this.add_rejector = this.add_rejector.bind(this);
      this.add_validater = this.add_validater.bind(this);
      this.is_null = this.is_null.bind(this);
      this.push = this.push.bind(this);
      this.update = this.update.bind(this);
      this.value = this.value.bind(this);
      this.reset = this.reset.bind(this);
   }

   reset(): IObserver<V> {
      this.observed = [];
      return this;
   }

   push(pack: Pack<V>): boolean {
      const val = pack[1];

      const same_value = _(this.value()[0])
         .isEqual(val);
      if (same_value) return false;

      const rejected = _(this.validater)
         .map(f => (f(pack)))
         .filter(e => !!e)
         .value().length;

      if (rejected > 0) return false;
      this.observed = this.observed
         .concat([pack])
         .slice(-this.length);
      this.notify.forEach(f => f(pack));
      this.call.forEach(f => f(val));
      if (this.first_value.length > 0) {
         this.first_value.push(val);
      }
      this.call = [];
      return true;
   }

   update(v: V): boolean {
      return this.push(["update", v]);
   }

   add_call(f: Apply<V>): IObserver<V> {
      if (this.is_null()) {
         this.call.push(f);
         return this;
      }
      f(this.value()[0]);
      return this;
   }

   add_call_chain<R>(f: Chain<V,R>):  Promise<R>{
      return new Promise<V>((res,rej)=>{
         if(this.is_null()){
            return this.call.push(res);
         }
         res(this.value()[0])
      }).then<R>(f);
   }


   add_notify(f: Notify<V>): IObserver<V> {
      this.notify.push(f);
      return this;
   }
   add_validater(f: Validater<V>): IObserver<V> {
      this.validater.push(f);
      return this;
   }
   add_rejector(f: Rejector<V>): IObserver<V> {
      this.validater.push(e => f(e[1]));
      return this;
   }
   value(): V[] {
      if (this.is_null()) return [];
      const r = this.observed.slice(-1)[0];
      return [r[1]];
   }
   is_null(): boolean {
      return this.observed.length < 1;
   }
}

export default Observer
