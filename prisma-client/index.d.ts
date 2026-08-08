
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Vehicle
 * 
 */
export type Vehicle = $Result.DefaultSelection<Prisma.$VehiclePayload>
/**
 * Model MaintenanceExpense
 * 
 */
export type MaintenanceExpense = $Result.DefaultSelection<Prisma.$MaintenanceExpensePayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Rental
 * 
 */
export type Rental = $Result.DefaultSelection<Prisma.$RentalPayload>
/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Vehicles
 * const vehicles = await prisma.vehicle.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Vehicles
   * const vehicles = await prisma.vehicle.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.vehicle`: Exposes CRUD operations for the **Vehicle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicles
    * const vehicles = await prisma.vehicle.findMany()
    * ```
    */
  get vehicle(): Prisma.VehicleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceExpense`: Exposes CRUD operations for the **MaintenanceExpense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceExpenses
    * const maintenanceExpenses = await prisma.maintenanceExpense.findMany()
    * ```
    */
  get maintenanceExpense(): Prisma.MaintenanceExpenseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rental`: Exposes CRUD operations for the **Rental** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rentals
    * const rentals = await prisma.rental.findMany()
    * ```
    */
  get rental(): Prisma.RentalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Vehicle: 'Vehicle',
    MaintenanceExpense: 'MaintenanceExpense',
    Customer: 'Customer',
    Rental: 'Rental',
    Setting: 'Setting'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "vehicle" | "maintenanceExpense" | "customer" | "rental" | "setting"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Vehicle: {
        payload: Prisma.$VehiclePayload<ExtArgs>
        fields: Prisma.VehicleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findFirst: {
            args: Prisma.VehicleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findMany: {
            args: Prisma.VehicleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          create: {
            args: Prisma.VehicleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          createMany: {
            args: Prisma.VehicleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          delete: {
            args: Prisma.VehicleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          update: {
            args: Prisma.VehicleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          deleteMany: {
            args: Prisma.VehicleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          upsert: {
            args: Prisma.VehicleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          aggregate: {
            args: Prisma.VehicleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle>
          }
          groupBy: {
            args: Prisma.VehicleGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceExpense: {
        payload: Prisma.$MaintenanceExpensePayload<ExtArgs>
        fields: Prisma.MaintenanceExpenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceExpenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceExpenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          findFirst: {
            args: Prisma.MaintenanceExpenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceExpenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          findMany: {
            args: Prisma.MaintenanceExpenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>[]
          }
          create: {
            args: Prisma.MaintenanceExpenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          createMany: {
            args: Prisma.MaintenanceExpenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceExpenseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>[]
          }
          delete: {
            args: Prisma.MaintenanceExpenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          update: {
            args: Prisma.MaintenanceExpenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceExpenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceExpenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceExpenseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceExpenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceExpensePayload>
          }
          aggregate: {
            args: Prisma.MaintenanceExpenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceExpense>
          }
          groupBy: {
            args: Prisma.MaintenanceExpenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceExpenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceExpenseCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceExpenseCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Rental: {
        payload: Prisma.$RentalPayload<ExtArgs>
        fields: Prisma.RentalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RentalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RentalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          findFirst: {
            args: Prisma.RentalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RentalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          findMany: {
            args: Prisma.RentalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>[]
          }
          create: {
            args: Prisma.RentalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          createMany: {
            args: Prisma.RentalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RentalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>[]
          }
          delete: {
            args: Prisma.RentalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          update: {
            args: Prisma.RentalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          deleteMany: {
            args: Prisma.RentalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RentalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RentalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>[]
          }
          upsert: {
            args: Prisma.RentalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RentalPayload>
          }
          aggregate: {
            args: Prisma.RentalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRental>
          }
          groupBy: {
            args: Prisma.RentalGroupByArgs<ExtArgs>
            result: $Utils.Optional<RentalGroupByOutputType>[]
          }
          count: {
            args: Prisma.RentalCountArgs<ExtArgs>
            result: $Utils.Optional<RentalCountAggregateOutputType> | number
          }
        }
      }
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    vehicle?: VehicleOmit
    maintenanceExpense?: MaintenanceExpenseOmit
    customer?: CustomerOmit
    rental?: RentalOmit
    setting?: SettingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type VehicleCountOutputType
   */

  export type VehicleCountOutputType = {
    rentals: number
    maintenance: number
  }

  export type VehicleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | VehicleCountOutputTypeCountRentalsArgs
    maintenance?: boolean | VehicleCountOutputTypeCountMaintenanceArgs
  }

  // Custom InputTypes
  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCountOutputType
     */
    select?: VehicleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountRentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountMaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceExpenseWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    rentals: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | CustomerCountOutputTypeCountRentalsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountRentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Vehicle
   */

  export type AggregateVehicle = {
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  export type VehicleAvgAggregateOutputType = {
    hourlyRate: number | null
    securityDeposit: number | null
    rate1hr: number | null
    rate3hr: number | null
    rate6hr: number | null
    rate12hr: number | null
    rate24hr: number | null
  }

  export type VehicleSumAggregateOutputType = {
    hourlyRate: number | null
    securityDeposit: number | null
    rate1hr: number | null
    rate3hr: number | null
    rate6hr: number | null
    rate12hr: number | null
    rate24hr: number | null
  }

  export type VehicleMinAggregateOutputType = {
    id: string | null
    vehicleNumber: string | null
    vehicleName: string | null
    vehicleType: string | null
    hourlyRate: number | null
    securityDeposit: number | null
    rate1hr: number | null
    rate3hr: number | null
    rate6hr: number | null
    rate12hr: number | null
    rate24hr: number | null
    description: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleMaxAggregateOutputType = {
    id: string | null
    vehicleNumber: string | null
    vehicleName: string | null
    vehicleType: string | null
    hourlyRate: number | null
    securityDeposit: number | null
    rate1hr: number | null
    rate3hr: number | null
    rate6hr: number | null
    rate12hr: number | null
    rate24hr: number | null
    description: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleCountAggregateOutputType = {
    id: number
    vehicleNumber: number
    vehicleName: number
    vehicleType: number
    hourlyRate: number
    securityDeposit: number
    rate1hr: number
    rate3hr: number
    rate6hr: number
    rate12hr: number
    rate24hr: number
    description: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VehicleAvgAggregateInputType = {
    hourlyRate?: true
    securityDeposit?: true
    rate1hr?: true
    rate3hr?: true
    rate6hr?: true
    rate12hr?: true
    rate24hr?: true
  }

  export type VehicleSumAggregateInputType = {
    hourlyRate?: true
    securityDeposit?: true
    rate1hr?: true
    rate3hr?: true
    rate6hr?: true
    rate12hr?: true
    rate24hr?: true
  }

  export type VehicleMinAggregateInputType = {
    id?: true
    vehicleNumber?: true
    vehicleName?: true
    vehicleType?: true
    hourlyRate?: true
    securityDeposit?: true
    rate1hr?: true
    rate3hr?: true
    rate6hr?: true
    rate12hr?: true
    rate24hr?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleMaxAggregateInputType = {
    id?: true
    vehicleNumber?: true
    vehicleName?: true
    vehicleType?: true
    hourlyRate?: true
    securityDeposit?: true
    rate1hr?: true
    rate3hr?: true
    rate6hr?: true
    rate12hr?: true
    rate24hr?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleCountAggregateInputType = {
    id?: true
    vehicleNumber?: true
    vehicleName?: true
    vehicleType?: true
    hourlyRate?: true
    securityDeposit?: true
    rate1hr?: true
    rate3hr?: true
    rate6hr?: true
    rate12hr?: true
    rate24hr?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VehicleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicle to aggregate.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vehicles
    **/
    _count?: true | VehicleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehicleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehicleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleMaxAggregateInputType
  }

  export type GetVehicleAggregateType<T extends VehicleAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle[P]>
      : GetScalarType<T[P], AggregateVehicle[P]>
  }




  export type VehicleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleWhereInput
    orderBy?: VehicleOrderByWithAggregationInput | VehicleOrderByWithAggregationInput[]
    by: VehicleScalarFieldEnum[] | VehicleScalarFieldEnum
    having?: VehicleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleCountAggregateInputType | true
    _avg?: VehicleAvgAggregateInputType
    _sum?: VehicleSumAggregateInputType
    _min?: VehicleMinAggregateInputType
    _max?: VehicleMaxAggregateInputType
  }

  export type VehicleGroupByOutputType = {
    id: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr: number | null
    rate3hr: number | null
    rate6hr: number | null
    rate12hr: number | null
    rate24hr: number | null
    description: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  type GetVehicleGroupByPayload<T extends VehicleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleGroupByOutputType[P]>
        }
      >
    >


  export type VehicleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleNumber?: boolean
    vehicleName?: boolean
    vehicleType?: boolean
    hourlyRate?: boolean
    securityDeposit?: boolean
    rate1hr?: boolean
    rate3hr?: boolean
    rate6hr?: boolean
    rate12hr?: boolean
    rate24hr?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rentals?: boolean | Vehicle$rentalsArgs<ExtArgs>
    maintenance?: boolean | Vehicle$maintenanceArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleNumber?: boolean
    vehicleName?: boolean
    vehicleType?: boolean
    hourlyRate?: boolean
    securityDeposit?: boolean
    rate1hr?: boolean
    rate3hr?: boolean
    rate6hr?: boolean
    rate12hr?: boolean
    rate24hr?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleNumber?: boolean
    vehicleName?: boolean
    vehicleType?: boolean
    hourlyRate?: boolean
    securityDeposit?: boolean
    rate1hr?: boolean
    rate3hr?: boolean
    rate6hr?: boolean
    rate12hr?: boolean
    rate24hr?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectScalar = {
    id?: boolean
    vehicleNumber?: boolean
    vehicleName?: boolean
    vehicleType?: boolean
    hourlyRate?: boolean
    securityDeposit?: boolean
    rate1hr?: boolean
    rate3hr?: boolean
    rate6hr?: boolean
    rate12hr?: boolean
    rate24hr?: boolean
    description?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VehicleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicleNumber" | "vehicleName" | "vehicleType" | "hourlyRate" | "securityDeposit" | "rate1hr" | "rate3hr" | "rate6hr" | "rate12hr" | "rate24hr" | "description" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["vehicle"]>
  export type VehicleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | Vehicle$rentalsArgs<ExtArgs>
    maintenance?: boolean | Vehicle$maintenanceArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VehicleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VehicleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VehiclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vehicle"
    objects: {
      rentals: Prisma.$RentalPayload<ExtArgs>[]
      maintenance: Prisma.$MaintenanceExpensePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicleNumber: string
      vehicleName: string
      vehicleType: string
      hourlyRate: number
      securityDeposit: number
      rate1hr: number | null
      rate3hr: number | null
      rate6hr: number | null
      rate12hr: number | null
      rate24hr: number | null
      description: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vehicle"]>
    composites: {}
  }

  type VehicleGetPayload<S extends boolean | null | undefined | VehicleDefaultArgs> = $Result.GetResult<Prisma.$VehiclePayload, S>

  type VehicleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleCountAggregateInputType | true
    }

  export interface VehicleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vehicle'], meta: { name: 'Vehicle' } }
    /**
     * Find zero or one Vehicle that matches the filter.
     * @param {VehicleFindUniqueArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleFindUniqueArgs>(args: SelectSubset<T, VehicleFindUniqueArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleFindUniqueOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleFindFirstArgs>(args?: SelectSubset<T, VehicleFindFirstArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicles
     * const vehicles = await prisma.vehicle.findMany()
     * 
     * // Get first 10 Vehicles
     * const vehicles = await prisma.vehicle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleFindManyArgs>(args?: SelectSubset<T, VehicleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle.
     * @param {VehicleCreateArgs} args - Arguments to create a Vehicle.
     * @example
     * // Create one Vehicle
     * const Vehicle = await prisma.vehicle.create({
     *   data: {
     *     // ... data to create a Vehicle
     *   }
     * })
     * 
     */
    create<T extends VehicleCreateArgs>(args: SelectSubset<T, VehicleCreateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicles.
     * @param {VehicleCreateManyArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleCreateManyArgs>(args?: SelectSubset<T, VehicleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicles and returns the data saved in the database.
     * @param {VehicleCreateManyAndReturnArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle.
     * @param {VehicleDeleteArgs} args - Arguments to delete one Vehicle.
     * @example
     * // Delete one Vehicle
     * const Vehicle = await prisma.vehicle.delete({
     *   where: {
     *     // ... filter to delete one Vehicle
     *   }
     * })
     * 
     */
    delete<T extends VehicleDeleteArgs>(args: SelectSubset<T, VehicleDeleteArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle.
     * @param {VehicleUpdateArgs} args - Arguments to update one Vehicle.
     * @example
     * // Update one Vehicle
     * const vehicle = await prisma.vehicle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleUpdateArgs>(args: SelectSubset<T, VehicleUpdateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicles.
     * @param {VehicleDeleteManyArgs} args - Arguments to filter Vehicles to delete.
     * @example
     * // Delete a few Vehicles
     * const { count } = await prisma.vehicle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleDeleteManyArgs>(args?: SelectSubset<T, VehicleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleUpdateManyArgs>(args: SelectSubset<T, VehicleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles and returns the data updated in the database.
     * @param {VehicleUpdateManyAndReturnArgs} args - Arguments to update many Vehicles.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle.
     * @param {VehicleUpsertArgs} args - Arguments to update or create a Vehicle.
     * @example
     * // Update or create a Vehicle
     * const vehicle = await prisma.vehicle.upsert({
     *   create: {
     *     // ... data to create a Vehicle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle we want to update
     *   }
     * })
     */
    upsert<T extends VehicleUpsertArgs>(args: SelectSubset<T, VehicleUpsertArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleCountArgs} args - Arguments to filter Vehicles to count.
     * @example
     * // Count the number of Vehicles
     * const count = await prisma.vehicle.count({
     *   where: {
     *     // ... the filter for the Vehicles we want to count
     *   }
     * })
    **/
    count<T extends VehicleCountArgs>(
      args?: Subset<T, VehicleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleAggregateArgs>(args: Subset<T, VehicleAggregateArgs>): Prisma.PrismaPromise<GetVehicleAggregateType<T>>

    /**
     * Group by Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleGroupByArgs['orderBy'] }
        : { orderBy?: VehicleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vehicle model
   */
  readonly fields: VehicleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vehicle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rentals<T extends Vehicle$rentalsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    maintenance<T extends Vehicle$maintenanceArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$maintenanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vehicle model
   */
  interface VehicleFieldRefs {
    readonly id: FieldRef<"Vehicle", 'String'>
    readonly vehicleNumber: FieldRef<"Vehicle", 'String'>
    readonly vehicleName: FieldRef<"Vehicle", 'String'>
    readonly vehicleType: FieldRef<"Vehicle", 'String'>
    readonly hourlyRate: FieldRef<"Vehicle", 'Float'>
    readonly securityDeposit: FieldRef<"Vehicle", 'Float'>
    readonly rate1hr: FieldRef<"Vehicle", 'Float'>
    readonly rate3hr: FieldRef<"Vehicle", 'Float'>
    readonly rate6hr: FieldRef<"Vehicle", 'Float'>
    readonly rate12hr: FieldRef<"Vehicle", 'Float'>
    readonly rate24hr: FieldRef<"Vehicle", 'Float'>
    readonly description: FieldRef<"Vehicle", 'String'>
    readonly status: FieldRef<"Vehicle", 'String'>
    readonly createdAt: FieldRef<"Vehicle", 'DateTime'>
    readonly updatedAt: FieldRef<"Vehicle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vehicle findUnique
   */
  export type VehicleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findUniqueOrThrow
   */
  export type VehicleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findFirst
   */
  export type VehicleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findFirstOrThrow
   */
  export type VehicleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findMany
   */
  export type VehicleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicles to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle create
   */
  export type VehicleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to create a Vehicle.
     */
    data: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
  }

  /**
   * Vehicle createMany
   */
  export type VehicleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
  }

  /**
   * Vehicle createManyAndReturn
   */
  export type VehicleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
  }

  /**
   * Vehicle update
   */
  export type VehicleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to update a Vehicle.
     */
    data: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
    /**
     * Choose, which Vehicle to update.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle updateMany
   */
  export type VehicleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
  }

  /**
   * Vehicle updateManyAndReturn
   */
  export type VehicleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
  }

  /**
   * Vehicle upsert
   */
  export type VehicleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The filter to search for the Vehicle to update in case it exists.
     */
    where: VehicleWhereUniqueInput
    /**
     * In case the Vehicle found by the `where` argument doesn't exist, create a new Vehicle with this data.
     */
    create: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
    /**
     * In case the Vehicle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
  }

  /**
   * Vehicle delete
   */
  export type VehicleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter which Vehicle to delete.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle deleteMany
   */
  export type VehicleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicles to delete
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to delete.
     */
    limit?: number
  }

  /**
   * Vehicle.rentals
   */
  export type Vehicle$rentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    cursor?: RentalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Vehicle.maintenance
   */
  export type Vehicle$maintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    where?: MaintenanceExpenseWhereInput
    orderBy?: MaintenanceExpenseOrderByWithRelationInput | MaintenanceExpenseOrderByWithRelationInput[]
    cursor?: MaintenanceExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MaintenanceExpenseScalarFieldEnum | MaintenanceExpenseScalarFieldEnum[]
  }

  /**
   * Vehicle without action
   */
  export type VehicleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
  }


  /**
   * Model MaintenanceExpense
   */

  export type AggregateMaintenanceExpense = {
    _count: MaintenanceExpenseCountAggregateOutputType | null
    _avg: MaintenanceExpenseAvgAggregateOutputType | null
    _sum: MaintenanceExpenseSumAggregateOutputType | null
    _min: MaintenanceExpenseMinAggregateOutputType | null
    _max: MaintenanceExpenseMaxAggregateOutputType | null
  }

  export type MaintenanceExpenseAvgAggregateOutputType = {
    amount: number | null
  }

  export type MaintenanceExpenseSumAggregateOutputType = {
    amount: number | null
  }

  export type MaintenanceExpenseMinAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    date: Date | null
    amount: number | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaintenanceExpenseMaxAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    date: Date | null
    amount: number | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MaintenanceExpenseCountAggregateOutputType = {
    id: number
    vehicleId: number
    date: number
    amount: number
    remarks: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MaintenanceExpenseAvgAggregateInputType = {
    amount?: true
  }

  export type MaintenanceExpenseSumAggregateInputType = {
    amount?: true
  }

  export type MaintenanceExpenseMinAggregateInputType = {
    id?: true
    vehicleId?: true
    date?: true
    amount?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaintenanceExpenseMaxAggregateInputType = {
    id?: true
    vehicleId?: true
    date?: true
    amount?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MaintenanceExpenseCountAggregateInputType = {
    id?: true
    vehicleId?: true
    date?: true
    amount?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MaintenanceExpenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceExpense to aggregate.
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceExpenses to fetch.
     */
    orderBy?: MaintenanceExpenseOrderByWithRelationInput | MaintenanceExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceExpenses
    **/
    _count?: true | MaintenanceExpenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceExpenseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceExpenseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceExpenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceExpenseMaxAggregateInputType
  }

  export type GetMaintenanceExpenseAggregateType<T extends MaintenanceExpenseAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceExpense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceExpense[P]>
      : GetScalarType<T[P], AggregateMaintenanceExpense[P]>
  }




  export type MaintenanceExpenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceExpenseWhereInput
    orderBy?: MaintenanceExpenseOrderByWithAggregationInput | MaintenanceExpenseOrderByWithAggregationInput[]
    by: MaintenanceExpenseScalarFieldEnum[] | MaintenanceExpenseScalarFieldEnum
    having?: MaintenanceExpenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceExpenseCountAggregateInputType | true
    _avg?: MaintenanceExpenseAvgAggregateInputType
    _sum?: MaintenanceExpenseSumAggregateInputType
    _min?: MaintenanceExpenseMinAggregateInputType
    _max?: MaintenanceExpenseMaxAggregateInputType
  }

  export type MaintenanceExpenseGroupByOutputType = {
    id: string
    vehicleId: string
    date: Date
    amount: number
    remarks: string | null
    createdAt: Date
    updatedAt: Date
    _count: MaintenanceExpenseCountAggregateOutputType | null
    _avg: MaintenanceExpenseAvgAggregateOutputType | null
    _sum: MaintenanceExpenseSumAggregateOutputType | null
    _min: MaintenanceExpenseMinAggregateOutputType | null
    _max: MaintenanceExpenseMaxAggregateOutputType | null
  }

  type GetMaintenanceExpenseGroupByPayload<T extends MaintenanceExpenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceExpenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceExpenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceExpenseGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceExpenseGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceExpenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    date?: boolean
    amount?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceExpense"]>

  export type MaintenanceExpenseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    date?: boolean
    amount?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceExpense"]>

  export type MaintenanceExpenseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    date?: boolean
    amount?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceExpense"]>

  export type MaintenanceExpenseSelectScalar = {
    id?: boolean
    vehicleId?: boolean
    date?: boolean
    amount?: boolean
    remarks?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MaintenanceExpenseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicleId" | "date" | "amount" | "remarks" | "createdAt" | "updatedAt", ExtArgs["result"]["maintenanceExpense"]>
  export type MaintenanceExpenseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type MaintenanceExpenseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type MaintenanceExpenseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $MaintenanceExpensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceExpense"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicleId: string
      date: Date
      amount: number
      remarks: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["maintenanceExpense"]>
    composites: {}
  }

  type MaintenanceExpenseGetPayload<S extends boolean | null | undefined | MaintenanceExpenseDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceExpensePayload, S>

  type MaintenanceExpenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceExpenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceExpenseCountAggregateInputType | true
    }

  export interface MaintenanceExpenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceExpense'], meta: { name: 'MaintenanceExpense' } }
    /**
     * Find zero or one MaintenanceExpense that matches the filter.
     * @param {MaintenanceExpenseFindUniqueArgs} args - Arguments to find a MaintenanceExpense
     * @example
     * // Get one MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceExpenseFindUniqueArgs>(args: SelectSubset<T, MaintenanceExpenseFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceExpense that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceExpenseFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceExpense
     * @example
     * // Get one MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceExpenseFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceExpenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceExpense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseFindFirstArgs} args - Arguments to find a MaintenanceExpense
     * @example
     * // Get one MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceExpenseFindFirstArgs>(args?: SelectSubset<T, MaintenanceExpenseFindFirstArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceExpense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseFindFirstOrThrowArgs} args - Arguments to find a MaintenanceExpense
     * @example
     * // Get one MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceExpenseFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceExpenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceExpenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceExpenses
     * const maintenanceExpenses = await prisma.maintenanceExpense.findMany()
     * 
     * // Get first 10 MaintenanceExpenses
     * const maintenanceExpenses = await prisma.maintenanceExpense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceExpenseWithIdOnly = await prisma.maintenanceExpense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceExpenseFindManyArgs>(args?: SelectSubset<T, MaintenanceExpenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceExpense.
     * @param {MaintenanceExpenseCreateArgs} args - Arguments to create a MaintenanceExpense.
     * @example
     * // Create one MaintenanceExpense
     * const MaintenanceExpense = await prisma.maintenanceExpense.create({
     *   data: {
     *     // ... data to create a MaintenanceExpense
     *   }
     * })
     * 
     */
    create<T extends MaintenanceExpenseCreateArgs>(args: SelectSubset<T, MaintenanceExpenseCreateArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceExpenses.
     * @param {MaintenanceExpenseCreateManyArgs} args - Arguments to create many MaintenanceExpenses.
     * @example
     * // Create many MaintenanceExpenses
     * const maintenanceExpense = await prisma.maintenanceExpense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceExpenseCreateManyArgs>(args?: SelectSubset<T, MaintenanceExpenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceExpenses and returns the data saved in the database.
     * @param {MaintenanceExpenseCreateManyAndReturnArgs} args - Arguments to create many MaintenanceExpenses.
     * @example
     * // Create many MaintenanceExpenses
     * const maintenanceExpense = await prisma.maintenanceExpense.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceExpenses and only return the `id`
     * const maintenanceExpenseWithIdOnly = await prisma.maintenanceExpense.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceExpenseCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceExpenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaintenanceExpense.
     * @param {MaintenanceExpenseDeleteArgs} args - Arguments to delete one MaintenanceExpense.
     * @example
     * // Delete one MaintenanceExpense
     * const MaintenanceExpense = await prisma.maintenanceExpense.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceExpense
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceExpenseDeleteArgs>(args: SelectSubset<T, MaintenanceExpenseDeleteArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceExpense.
     * @param {MaintenanceExpenseUpdateArgs} args - Arguments to update one MaintenanceExpense.
     * @example
     * // Update one MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceExpenseUpdateArgs>(args: SelectSubset<T, MaintenanceExpenseUpdateArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceExpenses.
     * @param {MaintenanceExpenseDeleteManyArgs} args - Arguments to filter MaintenanceExpenses to delete.
     * @example
     * // Delete a few MaintenanceExpenses
     * const { count } = await prisma.maintenanceExpense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceExpenseDeleteManyArgs>(args?: SelectSubset<T, MaintenanceExpenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceExpenses
     * const maintenanceExpense = await prisma.maintenanceExpense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceExpenseUpdateManyArgs>(args: SelectSubset<T, MaintenanceExpenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceExpenses and returns the data updated in the database.
     * @param {MaintenanceExpenseUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceExpenses.
     * @example
     * // Update many MaintenanceExpenses
     * const maintenanceExpense = await prisma.maintenanceExpense.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaintenanceExpenses and only return the `id`
     * const maintenanceExpenseWithIdOnly = await prisma.maintenanceExpense.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceExpenseUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceExpenseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaintenanceExpense.
     * @param {MaintenanceExpenseUpsertArgs} args - Arguments to update or create a MaintenanceExpense.
     * @example
     * // Update or create a MaintenanceExpense
     * const maintenanceExpense = await prisma.maintenanceExpense.upsert({
     *   create: {
     *     // ... data to create a MaintenanceExpense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceExpense we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceExpenseUpsertArgs>(args: SelectSubset<T, MaintenanceExpenseUpsertArgs<ExtArgs>>): Prisma__MaintenanceExpenseClient<$Result.GetResult<Prisma.$MaintenanceExpensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseCountArgs} args - Arguments to filter MaintenanceExpenses to count.
     * @example
     * // Count the number of MaintenanceExpenses
     * const count = await prisma.maintenanceExpense.count({
     *   where: {
     *     // ... the filter for the MaintenanceExpenses we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceExpenseCountArgs>(
      args?: Subset<T, MaintenanceExpenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceExpenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceExpenseAggregateArgs>(args: Subset<T, MaintenanceExpenseAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceExpenseAggregateType<T>>

    /**
     * Group by MaintenanceExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceExpenseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceExpenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceExpenseGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceExpenseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceExpenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceExpenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceExpense model
   */
  readonly fields: MaintenanceExpenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceExpense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceExpenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaintenanceExpense model
   */
  interface MaintenanceExpenseFieldRefs {
    readonly id: FieldRef<"MaintenanceExpense", 'String'>
    readonly vehicleId: FieldRef<"MaintenanceExpense", 'String'>
    readonly date: FieldRef<"MaintenanceExpense", 'DateTime'>
    readonly amount: FieldRef<"MaintenanceExpense", 'Float'>
    readonly remarks: FieldRef<"MaintenanceExpense", 'String'>
    readonly createdAt: FieldRef<"MaintenanceExpense", 'DateTime'>
    readonly updatedAt: FieldRef<"MaintenanceExpense", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceExpense findUnique
   */
  export type MaintenanceExpenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceExpense to fetch.
     */
    where: MaintenanceExpenseWhereUniqueInput
  }

  /**
   * MaintenanceExpense findUniqueOrThrow
   */
  export type MaintenanceExpenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceExpense to fetch.
     */
    where: MaintenanceExpenseWhereUniqueInput
  }

  /**
   * MaintenanceExpense findFirst
   */
  export type MaintenanceExpenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceExpense to fetch.
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceExpenses to fetch.
     */
    orderBy?: MaintenanceExpenseOrderByWithRelationInput | MaintenanceExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceExpenses.
     */
    cursor?: MaintenanceExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceExpenses.
     */
    distinct?: MaintenanceExpenseScalarFieldEnum | MaintenanceExpenseScalarFieldEnum[]
  }

  /**
   * MaintenanceExpense findFirstOrThrow
   */
  export type MaintenanceExpenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceExpense to fetch.
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceExpenses to fetch.
     */
    orderBy?: MaintenanceExpenseOrderByWithRelationInput | MaintenanceExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceExpenses.
     */
    cursor?: MaintenanceExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceExpenses.
     */
    distinct?: MaintenanceExpenseScalarFieldEnum | MaintenanceExpenseScalarFieldEnum[]
  }

  /**
   * MaintenanceExpense findMany
   */
  export type MaintenanceExpenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceExpenses to fetch.
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceExpenses to fetch.
     */
    orderBy?: MaintenanceExpenseOrderByWithRelationInput | MaintenanceExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceExpenses.
     */
    cursor?: MaintenanceExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceExpenses.
     */
    distinct?: MaintenanceExpenseScalarFieldEnum | MaintenanceExpenseScalarFieldEnum[]
  }

  /**
   * MaintenanceExpense create
   */
  export type MaintenanceExpenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceExpense.
     */
    data: XOR<MaintenanceExpenseCreateInput, MaintenanceExpenseUncheckedCreateInput>
  }

  /**
   * MaintenanceExpense createMany
   */
  export type MaintenanceExpenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceExpenses.
     */
    data: MaintenanceExpenseCreateManyInput | MaintenanceExpenseCreateManyInput[]
  }

  /**
   * MaintenanceExpense createManyAndReturn
   */
  export type MaintenanceExpenseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * The data used to create many MaintenanceExpenses.
     */
    data: MaintenanceExpenseCreateManyInput | MaintenanceExpenseCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceExpense update
   */
  export type MaintenanceExpenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceExpense.
     */
    data: XOR<MaintenanceExpenseUpdateInput, MaintenanceExpenseUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceExpense to update.
     */
    where: MaintenanceExpenseWhereUniqueInput
  }

  /**
   * MaintenanceExpense updateMany
   */
  export type MaintenanceExpenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceExpenses.
     */
    data: XOR<MaintenanceExpenseUpdateManyMutationInput, MaintenanceExpenseUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceExpenses to update
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * Limit how many MaintenanceExpenses to update.
     */
    limit?: number
  }

  /**
   * MaintenanceExpense updateManyAndReturn
   */
  export type MaintenanceExpenseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * The data used to update MaintenanceExpenses.
     */
    data: XOR<MaintenanceExpenseUpdateManyMutationInput, MaintenanceExpenseUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceExpenses to update
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * Limit how many MaintenanceExpenses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceExpense upsert
   */
  export type MaintenanceExpenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceExpense to update in case it exists.
     */
    where: MaintenanceExpenseWhereUniqueInput
    /**
     * In case the MaintenanceExpense found by the `where` argument doesn't exist, create a new MaintenanceExpense with this data.
     */
    create: XOR<MaintenanceExpenseCreateInput, MaintenanceExpenseUncheckedCreateInput>
    /**
     * In case the MaintenanceExpense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceExpenseUpdateInput, MaintenanceExpenseUncheckedUpdateInput>
  }

  /**
   * MaintenanceExpense delete
   */
  export type MaintenanceExpenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
    /**
     * Filter which MaintenanceExpense to delete.
     */
    where: MaintenanceExpenseWhereUniqueInput
  }

  /**
   * MaintenanceExpense deleteMany
   */
  export type MaintenanceExpenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceExpenses to delete
     */
    where?: MaintenanceExpenseWhereInput
    /**
     * Limit how many MaintenanceExpenses to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceExpense without action
   */
  export type MaintenanceExpenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceExpense
     */
    select?: MaintenanceExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceExpense
     */
    omit?: MaintenanceExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceExpenseInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    mobileNumber: string | null
    email: string | null
    address: string | null
    idProofType: string | null
    idProofNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    mobileNumber: string | null
    email: string | null
    address: string | null
    idProofType: string | null
    idProofNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    mobileNumber: number
    email: number
    address: number
    idProofType: number
    idProofNumber: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    mobileNumber?: true
    email?: true
    address?: true
    idProofType?: true
    idProofNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    mobileNumber?: true
    email?: true
    address?: true
    idProofType?: true
    idProofNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    mobileNumber?: true
    email?: true
    address?: true
    idProofType?: true
    idProofNumber?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    name: string
    mobileNumber: string
    email: string | null
    address: string | null
    idProofType: string
    idProofNumber: string
    createdAt: Date
    updatedAt: Date
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    mobileNumber?: boolean
    email?: boolean
    address?: boolean
    idProofType?: boolean
    idProofNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rentals?: boolean | Customer$rentalsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    mobileNumber?: boolean
    email?: boolean
    address?: boolean
    idProofType?: boolean
    idProofNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    mobileNumber?: boolean
    email?: boolean
    address?: boolean
    idProofType?: boolean
    idProofNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    mobileNumber?: boolean
    email?: boolean
    address?: boolean
    idProofType?: boolean
    idProofNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "mobileNumber" | "email" | "address" | "idProofType" | "idProofNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rentals?: boolean | Customer$rentalsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CustomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      rentals: Prisma.$RentalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      mobileNumber: string
      email: string | null
      address: string | null
      idProofType: string
      idProofNumber: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {CustomerUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rentals<T extends Customer$rentalsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$rentalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly mobileNumber: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly idProofType: FieldRef<"Customer", 'String'>
    readonly idProofNumber: FieldRef<"Customer", 'String'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer updateManyAndReturn
   */
  export type CustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.rentals
   */
  export type Customer$rentalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    cursor?: RentalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Rental
   */

  export type AggregateRental = {
    _count: RentalCountAggregateOutputType | null
    _avg: RentalAvgAggregateOutputType | null
    _sum: RentalSumAggregateOutputType | null
    _min: RentalMinAggregateOutputType | null
    _max: RentalMaxAggregateOutputType | null
  }

  export type RentalAvgAggregateOutputType = {
    id: number | null
    depositAmount: number | null
    totalHours: number | null
    totalAmount: number | null
    settlementAmount: number | null
  }

  export type RentalSumAggregateOutputType = {
    id: number | null
    depositAmount: number | null
    totalHours: number | null
    totalAmount: number | null
    settlementAmount: number | null
  }

  export type RentalMinAggregateOutputType = {
    id: number | null
    customerId: string | null
    vehicleId: string | null
    pickupDate: Date | null
    returnDate: Date | null
    depositAmount: number | null
    selectedPackage: string | null
    notes: string | null
    status: string | null
    totalHours: number | null
    totalAmount: number | null
    settlementAmount: number | null
    isAccident: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RentalMaxAggregateOutputType = {
    id: number | null
    customerId: string | null
    vehicleId: string | null
    pickupDate: Date | null
    returnDate: Date | null
    depositAmount: number | null
    selectedPackage: string | null
    notes: string | null
    status: string | null
    totalHours: number | null
    totalAmount: number | null
    settlementAmount: number | null
    isAccident: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RentalCountAggregateOutputType = {
    id: number
    customerId: number
    vehicleId: number
    pickupDate: number
    returnDate: number
    depositAmount: number
    selectedPackage: number
    notes: number
    status: number
    totalHours: number
    totalAmount: number
    settlementAmount: number
    isAccident: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RentalAvgAggregateInputType = {
    id?: true
    depositAmount?: true
    totalHours?: true
    totalAmount?: true
    settlementAmount?: true
  }

  export type RentalSumAggregateInputType = {
    id?: true
    depositAmount?: true
    totalHours?: true
    totalAmount?: true
    settlementAmount?: true
  }

  export type RentalMinAggregateInputType = {
    id?: true
    customerId?: true
    vehicleId?: true
    pickupDate?: true
    returnDate?: true
    depositAmount?: true
    selectedPackage?: true
    notes?: true
    status?: true
    totalHours?: true
    totalAmount?: true
    settlementAmount?: true
    isAccident?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RentalMaxAggregateInputType = {
    id?: true
    customerId?: true
    vehicleId?: true
    pickupDate?: true
    returnDate?: true
    depositAmount?: true
    selectedPackage?: true
    notes?: true
    status?: true
    totalHours?: true
    totalAmount?: true
    settlementAmount?: true
    isAccident?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RentalCountAggregateInputType = {
    id?: true
    customerId?: true
    vehicleId?: true
    pickupDate?: true
    returnDate?: true
    depositAmount?: true
    selectedPackage?: true
    notes?: true
    status?: true
    totalHours?: true
    totalAmount?: true
    settlementAmount?: true
    isAccident?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RentalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rental to aggregate.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rentals
    **/
    _count?: true | RentalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RentalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RentalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RentalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RentalMaxAggregateInputType
  }

  export type GetRentalAggregateType<T extends RentalAggregateArgs> = {
        [P in keyof T & keyof AggregateRental]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRental[P]>
      : GetScalarType<T[P], AggregateRental[P]>
  }




  export type RentalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RentalWhereInput
    orderBy?: RentalOrderByWithAggregationInput | RentalOrderByWithAggregationInput[]
    by: RentalScalarFieldEnum[] | RentalScalarFieldEnum
    having?: RentalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RentalCountAggregateInputType | true
    _avg?: RentalAvgAggregateInputType
    _sum?: RentalSumAggregateInputType
    _min?: RentalMinAggregateInputType
    _max?: RentalMaxAggregateInputType
  }

  export type RentalGroupByOutputType = {
    id: number
    customerId: string
    vehicleId: string
    pickupDate: Date
    returnDate: Date | null
    depositAmount: number
    selectedPackage: string
    notes: string | null
    status: string
    totalHours: number | null
    totalAmount: number | null
    settlementAmount: number | null
    isAccident: boolean
    createdAt: Date
    updatedAt: Date
    _count: RentalCountAggregateOutputType | null
    _avg: RentalAvgAggregateOutputType | null
    _sum: RentalSumAggregateOutputType | null
    _min: RentalMinAggregateOutputType | null
    _max: RentalMaxAggregateOutputType | null
  }

  type GetRentalGroupByPayload<T extends RentalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RentalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RentalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RentalGroupByOutputType[P]>
            : GetScalarType<T[P], RentalGroupByOutputType[P]>
        }
      >
    >


  export type RentalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    vehicleId?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    depositAmount?: boolean
    selectedPackage?: boolean
    notes?: boolean
    status?: boolean
    totalHours?: boolean
    totalAmount?: boolean
    settlementAmount?: boolean
    isAccident?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rental"]>

  export type RentalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    vehicleId?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    depositAmount?: boolean
    selectedPackage?: boolean
    notes?: boolean
    status?: boolean
    totalHours?: boolean
    totalAmount?: boolean
    settlementAmount?: boolean
    isAccident?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rental"]>

  export type RentalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    customerId?: boolean
    vehicleId?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    depositAmount?: boolean
    selectedPackage?: boolean
    notes?: boolean
    status?: boolean
    totalHours?: boolean
    totalAmount?: boolean
    settlementAmount?: boolean
    isAccident?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rental"]>

  export type RentalSelectScalar = {
    id?: boolean
    customerId?: boolean
    vehicleId?: boolean
    pickupDate?: boolean
    returnDate?: boolean
    depositAmount?: boolean
    selectedPackage?: boolean
    notes?: boolean
    status?: boolean
    totalHours?: boolean
    totalAmount?: boolean
    settlementAmount?: boolean
    isAccident?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RentalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "customerId" | "vehicleId" | "pickupDate" | "returnDate" | "depositAmount" | "selectedPackage" | "notes" | "status" | "totalHours" | "totalAmount" | "settlementAmount" | "isAccident" | "createdAt" | "updatedAt", ExtArgs["result"]["rental"]>
  export type RentalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type RentalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type RentalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $RentalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rental"
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      customerId: string
      vehicleId: string
      pickupDate: Date
      returnDate: Date | null
      depositAmount: number
      selectedPackage: string
      notes: string | null
      status: string
      totalHours: number | null
      totalAmount: number | null
      settlementAmount: number | null
      isAccident: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["rental"]>
    composites: {}
  }

  type RentalGetPayload<S extends boolean | null | undefined | RentalDefaultArgs> = $Result.GetResult<Prisma.$RentalPayload, S>

  type RentalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RentalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RentalCountAggregateInputType | true
    }

  export interface RentalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rental'], meta: { name: 'Rental' } }
    /**
     * Find zero or one Rental that matches the filter.
     * @param {RentalFindUniqueArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RentalFindUniqueArgs>(args: SelectSubset<T, RentalFindUniqueArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Rental that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RentalFindUniqueOrThrowArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RentalFindUniqueOrThrowArgs>(args: SelectSubset<T, RentalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rental that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindFirstArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RentalFindFirstArgs>(args?: SelectSubset<T, RentalFindFirstArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Rental that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindFirstOrThrowArgs} args - Arguments to find a Rental
     * @example
     * // Get one Rental
     * const rental = await prisma.rental.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RentalFindFirstOrThrowArgs>(args?: SelectSubset<T, RentalFindFirstOrThrowArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rentals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rentals
     * const rentals = await prisma.rental.findMany()
     * 
     * // Get first 10 Rentals
     * const rentals = await prisma.rental.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rentalWithIdOnly = await prisma.rental.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RentalFindManyArgs>(args?: SelectSubset<T, RentalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Rental.
     * @param {RentalCreateArgs} args - Arguments to create a Rental.
     * @example
     * // Create one Rental
     * const Rental = await prisma.rental.create({
     *   data: {
     *     // ... data to create a Rental
     *   }
     * })
     * 
     */
    create<T extends RentalCreateArgs>(args: SelectSubset<T, RentalCreateArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rentals.
     * @param {RentalCreateManyArgs} args - Arguments to create many Rentals.
     * @example
     * // Create many Rentals
     * const rental = await prisma.rental.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RentalCreateManyArgs>(args?: SelectSubset<T, RentalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rentals and returns the data saved in the database.
     * @param {RentalCreateManyAndReturnArgs} args - Arguments to create many Rentals.
     * @example
     * // Create many Rentals
     * const rental = await prisma.rental.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rentals and only return the `id`
     * const rentalWithIdOnly = await prisma.rental.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RentalCreateManyAndReturnArgs>(args?: SelectSubset<T, RentalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Rental.
     * @param {RentalDeleteArgs} args - Arguments to delete one Rental.
     * @example
     * // Delete one Rental
     * const Rental = await prisma.rental.delete({
     *   where: {
     *     // ... filter to delete one Rental
     *   }
     * })
     * 
     */
    delete<T extends RentalDeleteArgs>(args: SelectSubset<T, RentalDeleteArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Rental.
     * @param {RentalUpdateArgs} args - Arguments to update one Rental.
     * @example
     * // Update one Rental
     * const rental = await prisma.rental.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RentalUpdateArgs>(args: SelectSubset<T, RentalUpdateArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rentals.
     * @param {RentalDeleteManyArgs} args - Arguments to filter Rentals to delete.
     * @example
     * // Delete a few Rentals
     * const { count } = await prisma.rental.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RentalDeleteManyArgs>(args?: SelectSubset<T, RentalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rentals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rentals
     * const rental = await prisma.rental.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RentalUpdateManyArgs>(args: SelectSubset<T, RentalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rentals and returns the data updated in the database.
     * @param {RentalUpdateManyAndReturnArgs} args - Arguments to update many Rentals.
     * @example
     * // Update many Rentals
     * const rental = await prisma.rental.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rentals and only return the `id`
     * const rentalWithIdOnly = await prisma.rental.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RentalUpdateManyAndReturnArgs>(args: SelectSubset<T, RentalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Rental.
     * @param {RentalUpsertArgs} args - Arguments to update or create a Rental.
     * @example
     * // Update or create a Rental
     * const rental = await prisma.rental.upsert({
     *   create: {
     *     // ... data to create a Rental
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rental we want to update
     *   }
     * })
     */
    upsert<T extends RentalUpsertArgs>(args: SelectSubset<T, RentalUpsertArgs<ExtArgs>>): Prisma__RentalClient<$Result.GetResult<Prisma.$RentalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rentals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalCountArgs} args - Arguments to filter Rentals to count.
     * @example
     * // Count the number of Rentals
     * const count = await prisma.rental.count({
     *   where: {
     *     // ... the filter for the Rentals we want to count
     *   }
     * })
    **/
    count<T extends RentalCountArgs>(
      args?: Subset<T, RentalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RentalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rental.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RentalAggregateArgs>(args: Subset<T, RentalAggregateArgs>): Prisma.PrismaPromise<GetRentalAggregateType<T>>

    /**
     * Group by Rental.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RentalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RentalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RentalGroupByArgs['orderBy'] }
        : { orderBy?: RentalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RentalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRentalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rental model
   */
  readonly fields: RentalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rental.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RentalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rental model
   */
  interface RentalFieldRefs {
    readonly id: FieldRef<"Rental", 'Int'>
    readonly customerId: FieldRef<"Rental", 'String'>
    readonly vehicleId: FieldRef<"Rental", 'String'>
    readonly pickupDate: FieldRef<"Rental", 'DateTime'>
    readonly returnDate: FieldRef<"Rental", 'DateTime'>
    readonly depositAmount: FieldRef<"Rental", 'Float'>
    readonly selectedPackage: FieldRef<"Rental", 'String'>
    readonly notes: FieldRef<"Rental", 'String'>
    readonly status: FieldRef<"Rental", 'String'>
    readonly totalHours: FieldRef<"Rental", 'Float'>
    readonly totalAmount: FieldRef<"Rental", 'Float'>
    readonly settlementAmount: FieldRef<"Rental", 'Float'>
    readonly isAccident: FieldRef<"Rental", 'Boolean'>
    readonly createdAt: FieldRef<"Rental", 'DateTime'>
    readonly updatedAt: FieldRef<"Rental", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Rental findUnique
   */
  export type RentalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental findUniqueOrThrow
   */
  export type RentalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental findFirst
   */
  export type RentalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rentals.
     */
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental findFirstOrThrow
   */
  export type RentalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rental to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rentals.
     */
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental findMany
   */
  export type RentalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter, which Rentals to fetch.
     */
    where?: RentalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rentals to fetch.
     */
    orderBy?: RentalOrderByWithRelationInput | RentalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rentals.
     */
    cursor?: RentalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rentals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rentals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rentals.
     */
    distinct?: RentalScalarFieldEnum | RentalScalarFieldEnum[]
  }

  /**
   * Rental create
   */
  export type RentalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The data needed to create a Rental.
     */
    data: XOR<RentalCreateInput, RentalUncheckedCreateInput>
  }

  /**
   * Rental createMany
   */
  export type RentalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rentals.
     */
    data: RentalCreateManyInput | RentalCreateManyInput[]
  }

  /**
   * Rental createManyAndReturn
   */
  export type RentalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * The data used to create many Rentals.
     */
    data: RentalCreateManyInput | RentalCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rental update
   */
  export type RentalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The data needed to update a Rental.
     */
    data: XOR<RentalUpdateInput, RentalUncheckedUpdateInput>
    /**
     * Choose, which Rental to update.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental updateMany
   */
  export type RentalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rentals.
     */
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyInput>
    /**
     * Filter which Rentals to update
     */
    where?: RentalWhereInput
    /**
     * Limit how many Rentals to update.
     */
    limit?: number
  }

  /**
   * Rental updateManyAndReturn
   */
  export type RentalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * The data used to update Rentals.
     */
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyInput>
    /**
     * Filter which Rentals to update
     */
    where?: RentalWhereInput
    /**
     * Limit how many Rentals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Rental upsert
   */
  export type RentalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * The filter to search for the Rental to update in case it exists.
     */
    where: RentalWhereUniqueInput
    /**
     * In case the Rental found by the `where` argument doesn't exist, create a new Rental with this data.
     */
    create: XOR<RentalCreateInput, RentalUncheckedCreateInput>
    /**
     * In case the Rental was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RentalUpdateInput, RentalUncheckedUpdateInput>
  }

  /**
   * Rental delete
   */
  export type RentalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
    /**
     * Filter which Rental to delete.
     */
    where: RentalWhereUniqueInput
  }

  /**
   * Rental deleteMany
   */
  export type RentalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rentals to delete
     */
    where?: RentalWhereInput
    /**
     * Limit how many Rentals to delete.
     */
    limit?: number
  }

  /**
   * Rental without action
   */
  export type RentalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rental
     */
    select?: RentalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Rental
     */
    omit?: RentalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RentalInclude<ExtArgs> | null
  }


  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingAvgAggregateOutputType = {
    defaultDepositAmount: number | null
  }

  export type SettingSumAggregateOutputType = {
    defaultDepositAmount: number | null
  }

  export type SettingMinAggregateOutputType = {
    id: string | null
    currencySymbol: string | null
    hourlyRoundingRule: string | null
    defaultDepositAmount: number | null
    companyName: string | null
    companyAddress: string | null
    companyContact: string | null
    receiptLogoPath: string | null
    receiptFooterText: string | null
    settingsPassword: string | null
    updatedAt: Date | null
  }

  export type SettingMaxAggregateOutputType = {
    id: string | null
    currencySymbol: string | null
    hourlyRoundingRule: string | null
    defaultDepositAmount: number | null
    companyName: string | null
    companyAddress: string | null
    companyContact: string | null
    receiptLogoPath: string | null
    receiptFooterText: string | null
    settingsPassword: string | null
    updatedAt: Date | null
  }

  export type SettingCountAggregateOutputType = {
    id: number
    currencySymbol: number
    hourlyRoundingRule: number
    defaultDepositAmount: number
    companyName: number
    companyAddress: number
    companyContact: number
    receiptLogoPath: number
    receiptFooterText: number
    settingsPassword: number
    updatedAt: number
    _all: number
  }


  export type SettingAvgAggregateInputType = {
    defaultDepositAmount?: true
  }

  export type SettingSumAggregateInputType = {
    defaultDepositAmount?: true
  }

  export type SettingMinAggregateInputType = {
    id?: true
    currencySymbol?: true
    hourlyRoundingRule?: true
    defaultDepositAmount?: true
    companyName?: true
    companyAddress?: true
    companyContact?: true
    receiptLogoPath?: true
    receiptFooterText?: true
    settingsPassword?: true
    updatedAt?: true
  }

  export type SettingMaxAggregateInputType = {
    id?: true
    currencySymbol?: true
    hourlyRoundingRule?: true
    defaultDepositAmount?: true
    companyName?: true
    companyAddress?: true
    companyContact?: true
    receiptLogoPath?: true
    receiptFooterText?: true
    settingsPassword?: true
    updatedAt?: true
  }

  export type SettingCountAggregateInputType = {
    id?: true
    currencySymbol?: true
    hourlyRoundingRule?: true
    defaultDepositAmount?: true
    companyName?: true
    companyAddress?: true
    companyContact?: true
    receiptLogoPath?: true
    receiptFooterText?: true
    settingsPassword?: true
    updatedAt?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _avg?: SettingAvgAggregateInputType
    _sum?: SettingSumAggregateInputType
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    id: string
    currencySymbol: string
    hourlyRoundingRule: string
    defaultDepositAmount: number
    companyName: string
    companyAddress: string
    companyContact: string
    receiptLogoPath: string | null
    receiptFooterText: string
    settingsPassword: string
    updatedAt: Date
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    currencySymbol?: boolean
    hourlyRoundingRule?: boolean
    defaultDepositAmount?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyContact?: boolean
    receiptLogoPath?: boolean
    receiptFooterText?: boolean
    settingsPassword?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    currencySymbol?: boolean
    hourlyRoundingRule?: boolean
    defaultDepositAmount?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyContact?: boolean
    receiptLogoPath?: boolean
    receiptFooterText?: boolean
    settingsPassword?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    currencySymbol?: boolean
    hourlyRoundingRule?: boolean
    defaultDepositAmount?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyContact?: boolean
    receiptLogoPath?: boolean
    receiptFooterText?: boolean
    settingsPassword?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectScalar = {
    id?: boolean
    currencySymbol?: boolean
    hourlyRoundingRule?: boolean
    defaultDepositAmount?: boolean
    companyName?: boolean
    companyAddress?: boolean
    companyContact?: boolean
    receiptLogoPath?: boolean
    receiptFooterText?: boolean
    settingsPassword?: boolean
    updatedAt?: boolean
  }

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "currencySymbol" | "hourlyRoundingRule" | "defaultDepositAmount" | "companyName" | "companyAddress" | "companyContact" | "receiptLogoPath" | "receiptFooterText" | "settingsPassword" | "updatedAt", ExtArgs["result"]["setting"]>

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      currencySymbol: string
      hourlyRoundingRule: string
      defaultDepositAmount: number
      companyName: string
      companyAddress: string
      companyContact: string
      receiptLogoPath: string | null
      receiptFooterText: string
      settingsPassword: string
      updatedAt: Date
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingWithIdOnly = await prisma.setting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SettingUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly id: FieldRef<"Setting", 'String'>
    readonly currencySymbol: FieldRef<"Setting", 'String'>
    readonly hourlyRoundingRule: FieldRef<"Setting", 'String'>
    readonly defaultDepositAmount: FieldRef<"Setting", 'Float'>
    readonly companyName: FieldRef<"Setting", 'String'>
    readonly companyAddress: FieldRef<"Setting", 'String'>
    readonly companyContact: FieldRef<"Setting", 'String'>
    readonly receiptLogoPath: FieldRef<"Setting", 'String'>
    readonly receiptFooterText: FieldRef<"Setting", 'String'>
    readonly settingsPassword: FieldRef<"Setting", 'String'>
    readonly updatedAt: FieldRef<"Setting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
  }

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting updateManyAndReturn
   */
  export type SettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const VehicleScalarFieldEnum: {
    id: 'id',
    vehicleNumber: 'vehicleNumber',
    vehicleName: 'vehicleName',
    vehicleType: 'vehicleType',
    hourlyRate: 'hourlyRate',
    securityDeposit: 'securityDeposit',
    rate1hr: 'rate1hr',
    rate3hr: 'rate3hr',
    rate6hr: 'rate6hr',
    rate12hr: 'rate12hr',
    rate24hr: 'rate24hr',
    description: 'description',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum]


  export const MaintenanceExpenseScalarFieldEnum: {
    id: 'id',
    vehicleId: 'vehicleId',
    date: 'date',
    amount: 'amount',
    remarks: 'remarks',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MaintenanceExpenseScalarFieldEnum = (typeof MaintenanceExpenseScalarFieldEnum)[keyof typeof MaintenanceExpenseScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    mobileNumber: 'mobileNumber',
    email: 'email',
    address: 'address',
    idProofType: 'idProofType',
    idProofNumber: 'idProofNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const RentalScalarFieldEnum: {
    id: 'id',
    customerId: 'customerId',
    vehicleId: 'vehicleId',
    pickupDate: 'pickupDate',
    returnDate: 'returnDate',
    depositAmount: 'depositAmount',
    selectedPackage: 'selectedPackage',
    notes: 'notes',
    status: 'status',
    totalHours: 'totalHours',
    totalAmount: 'totalAmount',
    settlementAmount: 'settlementAmount',
    isAccident: 'isAccident',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RentalScalarFieldEnum = (typeof RentalScalarFieldEnum)[keyof typeof RentalScalarFieldEnum]


  export const SettingScalarFieldEnum: {
    id: 'id',
    currencySymbol: 'currencySymbol',
    hourlyRoundingRule: 'hourlyRoundingRule',
    defaultDepositAmount: 'defaultDepositAmount',
    companyName: 'companyName',
    companyAddress: 'companyAddress',
    companyContact: 'companyContact',
    receiptLogoPath: 'receiptLogoPath',
    receiptFooterText: 'receiptFooterText',
    settingsPassword: 'settingsPassword',
    updatedAt: 'updatedAt'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type VehicleWhereInput = {
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    id?: StringFilter<"Vehicle"> | string
    vehicleNumber?: StringFilter<"Vehicle"> | string
    vehicleName?: StringFilter<"Vehicle"> | string
    vehicleType?: StringFilter<"Vehicle"> | string
    hourlyRate?: FloatFilter<"Vehicle"> | number
    securityDeposit?: FloatFilter<"Vehicle"> | number
    rate1hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate3hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate6hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate12hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate24hr?: FloatNullableFilter<"Vehicle"> | number | null
    description?: StringNullableFilter<"Vehicle"> | string | null
    status?: StringFilter<"Vehicle"> | string
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    rentals?: RentalListRelationFilter
    maintenance?: MaintenanceExpenseListRelationFilter
  }

  export type VehicleOrderByWithRelationInput = {
    id?: SortOrder
    vehicleNumber?: SortOrder
    vehicleName?: SortOrder
    vehicleType?: SortOrder
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrderInput | SortOrder
    rate3hr?: SortOrderInput | SortOrder
    rate6hr?: SortOrderInput | SortOrder
    rate12hr?: SortOrderInput | SortOrder
    rate24hr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rentals?: RentalOrderByRelationAggregateInput
    maintenance?: MaintenanceExpenseOrderByRelationAggregateInput
  }

  export type VehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    vehicleNumber?: string
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    vehicleName?: StringFilter<"Vehicle"> | string
    vehicleType?: StringFilter<"Vehicle"> | string
    hourlyRate?: FloatFilter<"Vehicle"> | number
    securityDeposit?: FloatFilter<"Vehicle"> | number
    rate1hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate3hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate6hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate12hr?: FloatNullableFilter<"Vehicle"> | number | null
    rate24hr?: FloatNullableFilter<"Vehicle"> | number | null
    description?: StringNullableFilter<"Vehicle"> | string | null
    status?: StringFilter<"Vehicle"> | string
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    rentals?: RentalListRelationFilter
    maintenance?: MaintenanceExpenseListRelationFilter
  }, "id" | "vehicleNumber">

  export type VehicleOrderByWithAggregationInput = {
    id?: SortOrder
    vehicleNumber?: SortOrder
    vehicleName?: SortOrder
    vehicleType?: SortOrder
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrderInput | SortOrder
    rate3hr?: SortOrderInput | SortOrder
    rate6hr?: SortOrderInput | SortOrder
    rate12hr?: SortOrderInput | SortOrder
    rate24hr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VehicleCountOrderByAggregateInput
    _avg?: VehicleAvgOrderByAggregateInput
    _max?: VehicleMaxOrderByAggregateInput
    _min?: VehicleMinOrderByAggregateInput
    _sum?: VehicleSumOrderByAggregateInput
  }

  export type VehicleScalarWhereWithAggregatesInput = {
    AND?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    OR?: VehicleScalarWhereWithAggregatesInput[]
    NOT?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vehicle"> | string
    vehicleNumber?: StringWithAggregatesFilter<"Vehicle"> | string
    vehicleName?: StringWithAggregatesFilter<"Vehicle"> | string
    vehicleType?: StringWithAggregatesFilter<"Vehicle"> | string
    hourlyRate?: FloatWithAggregatesFilter<"Vehicle"> | number
    securityDeposit?: FloatWithAggregatesFilter<"Vehicle"> | number
    rate1hr?: FloatNullableWithAggregatesFilter<"Vehicle"> | number | null
    rate3hr?: FloatNullableWithAggregatesFilter<"Vehicle"> | number | null
    rate6hr?: FloatNullableWithAggregatesFilter<"Vehicle"> | number | null
    rate12hr?: FloatNullableWithAggregatesFilter<"Vehicle"> | number | null
    rate24hr?: FloatNullableWithAggregatesFilter<"Vehicle"> | number | null
    description?: StringNullableWithAggregatesFilter<"Vehicle"> | string | null
    status?: StringWithAggregatesFilter<"Vehicle"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
  }

  export type MaintenanceExpenseWhereInput = {
    AND?: MaintenanceExpenseWhereInput | MaintenanceExpenseWhereInput[]
    OR?: MaintenanceExpenseWhereInput[]
    NOT?: MaintenanceExpenseWhereInput | MaintenanceExpenseWhereInput[]
    id?: StringFilter<"MaintenanceExpense"> | string
    vehicleId?: StringFilter<"MaintenanceExpense"> | string
    date?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    amount?: FloatFilter<"MaintenanceExpense"> | number
    remarks?: StringNullableFilter<"MaintenanceExpense"> | string | null
    createdAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    updatedAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type MaintenanceExpenseOrderByWithRelationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    date?: SortOrder
    amount?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type MaintenanceExpenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceExpenseWhereInput | MaintenanceExpenseWhereInput[]
    OR?: MaintenanceExpenseWhereInput[]
    NOT?: MaintenanceExpenseWhereInput | MaintenanceExpenseWhereInput[]
    vehicleId?: StringFilter<"MaintenanceExpense"> | string
    date?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    amount?: FloatFilter<"MaintenanceExpense"> | number
    remarks?: StringNullableFilter<"MaintenanceExpense"> | string | null
    createdAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    updatedAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type MaintenanceExpenseOrderByWithAggregationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    date?: SortOrder
    amount?: SortOrder
    remarks?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MaintenanceExpenseCountOrderByAggregateInput
    _avg?: MaintenanceExpenseAvgOrderByAggregateInput
    _max?: MaintenanceExpenseMaxOrderByAggregateInput
    _min?: MaintenanceExpenseMinOrderByAggregateInput
    _sum?: MaintenanceExpenseSumOrderByAggregateInput
  }

  export type MaintenanceExpenseScalarWhereWithAggregatesInput = {
    AND?: MaintenanceExpenseScalarWhereWithAggregatesInput | MaintenanceExpenseScalarWhereWithAggregatesInput[]
    OR?: MaintenanceExpenseScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceExpenseScalarWhereWithAggregatesInput | MaintenanceExpenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceExpense"> | string
    vehicleId?: StringWithAggregatesFilter<"MaintenanceExpense"> | string
    date?: DateTimeWithAggregatesFilter<"MaintenanceExpense"> | Date | string
    amount?: FloatWithAggregatesFilter<"MaintenanceExpense"> | number
    remarks?: StringNullableWithAggregatesFilter<"MaintenanceExpense"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MaintenanceExpense"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MaintenanceExpense"> | Date | string
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    mobileNumber?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    idProofType?: StringFilter<"Customer"> | string
    idProofNumber?: StringFilter<"Customer"> | string
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    rentals?: RentalListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    mobileNumber?: SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    idProofType?: SortOrder
    idProofNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rentals?: RentalOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    mobileNumber?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    address?: StringNullableFilter<"Customer"> | string | null
    idProofType?: StringFilter<"Customer"> | string
    idProofNumber?: StringFilter<"Customer"> | string
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    rentals?: RentalListRelationFilter
  }, "id">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    mobileNumber?: SortOrder
    email?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    idProofType?: SortOrder
    idProofNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    mobileNumber?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    idProofType?: StringWithAggregatesFilter<"Customer"> | string
    idProofNumber?: StringWithAggregatesFilter<"Customer"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type RentalWhereInput = {
    AND?: RentalWhereInput | RentalWhereInput[]
    OR?: RentalWhereInput[]
    NOT?: RentalWhereInput | RentalWhereInput[]
    id?: IntFilter<"Rental"> | number
    customerId?: StringFilter<"Rental"> | string
    vehicleId?: StringFilter<"Rental"> | string
    pickupDate?: DateTimeFilter<"Rental"> | Date | string
    returnDate?: DateTimeNullableFilter<"Rental"> | Date | string | null
    depositAmount?: FloatFilter<"Rental"> | number
    selectedPackage?: StringFilter<"Rental"> | string
    notes?: StringNullableFilter<"Rental"> | string | null
    status?: StringFilter<"Rental"> | string
    totalHours?: FloatNullableFilter<"Rental"> | number | null
    totalAmount?: FloatNullableFilter<"Rental"> | number | null
    settlementAmount?: FloatNullableFilter<"Rental"> | number | null
    isAccident?: BoolFilter<"Rental"> | boolean
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type RentalOrderByWithRelationInput = {
    id?: SortOrder
    customerId?: SortOrder
    vehicleId?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrderInput | SortOrder
    depositAmount?: SortOrder
    selectedPackage?: SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    totalHours?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    settlementAmount?: SortOrderInput | SortOrder
    isAccident?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    customer?: CustomerOrderByWithRelationInput
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type RentalWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RentalWhereInput | RentalWhereInput[]
    OR?: RentalWhereInput[]
    NOT?: RentalWhereInput | RentalWhereInput[]
    customerId?: StringFilter<"Rental"> | string
    vehicleId?: StringFilter<"Rental"> | string
    pickupDate?: DateTimeFilter<"Rental"> | Date | string
    returnDate?: DateTimeNullableFilter<"Rental"> | Date | string | null
    depositAmount?: FloatFilter<"Rental"> | number
    selectedPackage?: StringFilter<"Rental"> | string
    notes?: StringNullableFilter<"Rental"> | string | null
    status?: StringFilter<"Rental"> | string
    totalHours?: FloatNullableFilter<"Rental"> | number | null
    totalAmount?: FloatNullableFilter<"Rental"> | number | null
    settlementAmount?: FloatNullableFilter<"Rental"> | number | null
    isAccident?: BoolFilter<"Rental"> | boolean
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type RentalOrderByWithAggregationInput = {
    id?: SortOrder
    customerId?: SortOrder
    vehicleId?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrderInput | SortOrder
    depositAmount?: SortOrder
    selectedPackage?: SortOrder
    notes?: SortOrderInput | SortOrder
    status?: SortOrder
    totalHours?: SortOrderInput | SortOrder
    totalAmount?: SortOrderInput | SortOrder
    settlementAmount?: SortOrderInput | SortOrder
    isAccident?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RentalCountOrderByAggregateInput
    _avg?: RentalAvgOrderByAggregateInput
    _max?: RentalMaxOrderByAggregateInput
    _min?: RentalMinOrderByAggregateInput
    _sum?: RentalSumOrderByAggregateInput
  }

  export type RentalScalarWhereWithAggregatesInput = {
    AND?: RentalScalarWhereWithAggregatesInput | RentalScalarWhereWithAggregatesInput[]
    OR?: RentalScalarWhereWithAggregatesInput[]
    NOT?: RentalScalarWhereWithAggregatesInput | RentalScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Rental"> | number
    customerId?: StringWithAggregatesFilter<"Rental"> | string
    vehicleId?: StringWithAggregatesFilter<"Rental"> | string
    pickupDate?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
    returnDate?: DateTimeNullableWithAggregatesFilter<"Rental"> | Date | string | null
    depositAmount?: FloatWithAggregatesFilter<"Rental"> | number
    selectedPackage?: StringWithAggregatesFilter<"Rental"> | string
    notes?: StringNullableWithAggregatesFilter<"Rental"> | string | null
    status?: StringWithAggregatesFilter<"Rental"> | string
    totalHours?: FloatNullableWithAggregatesFilter<"Rental"> | number | null
    totalAmount?: FloatNullableWithAggregatesFilter<"Rental"> | number | null
    settlementAmount?: FloatNullableWithAggregatesFilter<"Rental"> | number | null
    isAccident?: BoolWithAggregatesFilter<"Rental"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Rental"> | Date | string
  }

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    id?: StringFilter<"Setting"> | string
    currencySymbol?: StringFilter<"Setting"> | string
    hourlyRoundingRule?: StringFilter<"Setting"> | string
    defaultDepositAmount?: FloatFilter<"Setting"> | number
    companyName?: StringFilter<"Setting"> | string
    companyAddress?: StringFilter<"Setting"> | string
    companyContact?: StringFilter<"Setting"> | string
    receiptLogoPath?: StringNullableFilter<"Setting"> | string | null
    receiptFooterText?: StringFilter<"Setting"> | string
    settingsPassword?: StringFilter<"Setting"> | string
    updatedAt?: DateTimeFilter<"Setting"> | Date | string
  }

  export type SettingOrderByWithRelationInput = {
    id?: SortOrder
    currencySymbol?: SortOrder
    hourlyRoundingRule?: SortOrder
    defaultDepositAmount?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyContact?: SortOrder
    receiptLogoPath?: SortOrderInput | SortOrder
    receiptFooterText?: SortOrder
    settingsPassword?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    currencySymbol?: StringFilter<"Setting"> | string
    hourlyRoundingRule?: StringFilter<"Setting"> | string
    defaultDepositAmount?: FloatFilter<"Setting"> | number
    companyName?: StringFilter<"Setting"> | string
    companyAddress?: StringFilter<"Setting"> | string
    companyContact?: StringFilter<"Setting"> | string
    receiptLogoPath?: StringNullableFilter<"Setting"> | string | null
    receiptFooterText?: StringFilter<"Setting"> | string
    settingsPassword?: StringFilter<"Setting"> | string
    updatedAt?: DateTimeFilter<"Setting"> | Date | string
  }, "id">

  export type SettingOrderByWithAggregationInput = {
    id?: SortOrder
    currencySymbol?: SortOrder
    hourlyRoundingRule?: SortOrder
    defaultDepositAmount?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyContact?: SortOrder
    receiptLogoPath?: SortOrderInput | SortOrder
    receiptFooterText?: SortOrder
    settingsPassword?: SortOrder
    updatedAt?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _avg?: SettingAvgOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
    _sum?: SettingSumOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Setting"> | string
    currencySymbol?: StringWithAggregatesFilter<"Setting"> | string
    hourlyRoundingRule?: StringWithAggregatesFilter<"Setting"> | string
    defaultDepositAmount?: FloatWithAggregatesFilter<"Setting"> | number
    companyName?: StringWithAggregatesFilter<"Setting"> | string
    companyAddress?: StringWithAggregatesFilter<"Setting"> | string
    companyContact?: StringWithAggregatesFilter<"Setting"> | string
    receiptLogoPath?: StringNullableWithAggregatesFilter<"Setting"> | string | null
    receiptFooterText?: StringWithAggregatesFilter<"Setting"> | string
    settingsPassword?: StringWithAggregatesFilter<"Setting"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"Setting"> | Date | string
  }

  export type VehicleCreateInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutVehicleInput
    maintenance?: MaintenanceExpenseCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutVehicleInput
    maintenance?: MaintenanceExpenseUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutVehicleNestedInput
    maintenance?: MaintenanceExpenseUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutVehicleNestedInput
    maintenance?: MaintenanceExpenseUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateManyInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseCreateInput = {
    id?: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicle: VehicleCreateNestedOneWithoutMaintenanceInput
  }

  export type MaintenanceExpenseUncheckedCreateInput = {
    id?: string
    vehicleId: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceExpenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutMaintenanceNestedInput
  }

  export type MaintenanceExpenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseCreateManyInput = {
    id?: string
    vehicleId: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceExpenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    mobileNumber: string
    email?: string | null
    address?: string | null
    idProofType: string
    idProofNumber: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    name: string
    mobileNumber: string
    email?: string | null
    address?: string | null
    idProofType: string
    idProofNumber: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    name: string
    mobileNumber: string
    email?: string | null
    address?: string | null
    idProofType: string
    idProofNumber: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateInput = {
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutRentalsInput
    vehicle: VehicleCreateNestedOneWithoutRentalsInput
  }

  export type RentalUncheckedCreateInput = {
    id?: number
    customerId: string
    vehicleId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateInput = {
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutRentalsNestedInput
    vehicle?: VehicleUpdateOneRequiredWithoutRentalsNestedInput
  }

  export type RentalUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateManyInput = {
    id?: number
    customerId: string
    vehicleId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateManyMutationInput = {
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateInput = {
    id?: string
    currencySymbol?: string
    hourlyRoundingRule?: string
    defaultDepositAmount?: number
    companyName?: string
    companyAddress?: string
    companyContact?: string
    receiptLogoPath?: string | null
    receiptFooterText?: string
    settingsPassword?: string
    updatedAt?: Date | string
  }

  export type SettingUncheckedCreateInput = {
    id?: string
    currencySymbol?: string
    hourlyRoundingRule?: string
    defaultDepositAmount?: number
    companyName?: string
    companyAddress?: string
    companyContact?: string
    receiptLogoPath?: string | null
    receiptFooterText?: string
    settingsPassword?: string
    updatedAt?: Date | string
  }

  export type SettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencySymbol?: StringFieldUpdateOperationsInput | string
    hourlyRoundingRule?: StringFieldUpdateOperationsInput | string
    defaultDepositAmount?: FloatFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyContact?: StringFieldUpdateOperationsInput | string
    receiptLogoPath?: NullableStringFieldUpdateOperationsInput | string | null
    receiptFooterText?: StringFieldUpdateOperationsInput | string
    settingsPassword?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencySymbol?: StringFieldUpdateOperationsInput | string
    hourlyRoundingRule?: StringFieldUpdateOperationsInput | string
    defaultDepositAmount?: FloatFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyContact?: StringFieldUpdateOperationsInput | string
    receiptLogoPath?: NullableStringFieldUpdateOperationsInput | string | null
    receiptFooterText?: StringFieldUpdateOperationsInput | string
    settingsPassword?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateManyInput = {
    id?: string
    currencySymbol?: string
    hourlyRoundingRule?: string
    defaultDepositAmount?: number
    companyName?: string
    companyAddress?: string
    companyContact?: string
    receiptLogoPath?: string | null
    receiptFooterText?: string
    settingsPassword?: string
    updatedAt?: Date | string
  }

  export type SettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencySymbol?: StringFieldUpdateOperationsInput | string
    hourlyRoundingRule?: StringFieldUpdateOperationsInput | string
    defaultDepositAmount?: FloatFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyContact?: StringFieldUpdateOperationsInput | string
    receiptLogoPath?: NullableStringFieldUpdateOperationsInput | string | null
    receiptFooterText?: StringFieldUpdateOperationsInput | string
    settingsPassword?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    currencySymbol?: StringFieldUpdateOperationsInput | string
    hourlyRoundingRule?: StringFieldUpdateOperationsInput | string
    defaultDepositAmount?: FloatFieldUpdateOperationsInput | number
    companyName?: StringFieldUpdateOperationsInput | string
    companyAddress?: StringFieldUpdateOperationsInput | string
    companyContact?: StringFieldUpdateOperationsInput | string
    receiptLogoPath?: NullableStringFieldUpdateOperationsInput | string | null
    receiptFooterText?: StringFieldUpdateOperationsInput | string
    settingsPassword?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RentalListRelationFilter = {
    every?: RentalWhereInput
    some?: RentalWhereInput
    none?: RentalWhereInput
  }

  export type MaintenanceExpenseListRelationFilter = {
    every?: MaintenanceExpenseWhereInput
    some?: MaintenanceExpenseWhereInput
    none?: MaintenanceExpenseWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RentalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MaintenanceExpenseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleCountOrderByAggregateInput = {
    id?: SortOrder
    vehicleNumber?: SortOrder
    vehicleName?: SortOrder
    vehicleType?: SortOrder
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrder
    rate3hr?: SortOrder
    rate6hr?: SortOrder
    rate12hr?: SortOrder
    rate24hr?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleAvgOrderByAggregateInput = {
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrder
    rate3hr?: SortOrder
    rate6hr?: SortOrder
    rate12hr?: SortOrder
    rate24hr?: SortOrder
  }

  export type VehicleMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicleNumber?: SortOrder
    vehicleName?: SortOrder
    vehicleType?: SortOrder
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrder
    rate3hr?: SortOrder
    rate6hr?: SortOrder
    rate12hr?: SortOrder
    rate24hr?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleMinOrderByAggregateInput = {
    id?: SortOrder
    vehicleNumber?: SortOrder
    vehicleName?: SortOrder
    vehicleType?: SortOrder
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrder
    rate3hr?: SortOrder
    rate6hr?: SortOrder
    rate12hr?: SortOrder
    rate24hr?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleSumOrderByAggregateInput = {
    hourlyRate?: SortOrder
    securityDeposit?: SortOrder
    rate1hr?: SortOrder
    rate3hr?: SortOrder
    rate6hr?: SortOrder
    rate12hr?: SortOrder
    rate24hr?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type VehicleScalarRelationFilter = {
    is?: VehicleWhereInput
    isNot?: VehicleWhereInput
  }

  export type MaintenanceExpenseCountOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    date?: SortOrder
    amount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaintenanceExpenseAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type MaintenanceExpenseMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    date?: SortOrder
    amount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaintenanceExpenseMinOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    date?: SortOrder
    amount?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MaintenanceExpenseSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mobileNumber?: SortOrder
    email?: SortOrder
    address?: SortOrder
    idProofType?: SortOrder
    idProofNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mobileNumber?: SortOrder
    email?: SortOrder
    address?: SortOrder
    idProofType?: SortOrder
    idProofNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    mobileNumber?: SortOrder
    email?: SortOrder
    address?: SortOrder
    idProofType?: SortOrder
    idProofNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type RentalCountOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    vehicleId?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    depositAmount?: SortOrder
    selectedPackage?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    totalHours?: SortOrder
    totalAmount?: SortOrder
    settlementAmount?: SortOrder
    isAccident?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalAvgOrderByAggregateInput = {
    id?: SortOrder
    depositAmount?: SortOrder
    totalHours?: SortOrder
    totalAmount?: SortOrder
    settlementAmount?: SortOrder
  }

  export type RentalMaxOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    vehicleId?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    depositAmount?: SortOrder
    selectedPackage?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    totalHours?: SortOrder
    totalAmount?: SortOrder
    settlementAmount?: SortOrder
    isAccident?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalMinOrderByAggregateInput = {
    id?: SortOrder
    customerId?: SortOrder
    vehicleId?: SortOrder
    pickupDate?: SortOrder
    returnDate?: SortOrder
    depositAmount?: SortOrder
    selectedPackage?: SortOrder
    notes?: SortOrder
    status?: SortOrder
    totalHours?: SortOrder
    totalAmount?: SortOrder
    settlementAmount?: SortOrder
    isAccident?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RentalSumOrderByAggregateInput = {
    id?: SortOrder
    depositAmount?: SortOrder
    totalHours?: SortOrder
    totalAmount?: SortOrder
    settlementAmount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SettingCountOrderByAggregateInput = {
    id?: SortOrder
    currencySymbol?: SortOrder
    hourlyRoundingRule?: SortOrder
    defaultDepositAmount?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyContact?: SortOrder
    receiptLogoPath?: SortOrder
    receiptFooterText?: SortOrder
    settingsPassword?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingAvgOrderByAggregateInput = {
    defaultDepositAmount?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    id?: SortOrder
    currencySymbol?: SortOrder
    hourlyRoundingRule?: SortOrder
    defaultDepositAmount?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyContact?: SortOrder
    receiptLogoPath?: SortOrder
    receiptFooterText?: SortOrder
    settingsPassword?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    id?: SortOrder
    currencySymbol?: SortOrder
    hourlyRoundingRule?: SortOrder
    defaultDepositAmount?: SortOrder
    companyName?: SortOrder
    companyAddress?: SortOrder
    companyContact?: SortOrder
    receiptLogoPath?: SortOrder
    receiptFooterText?: SortOrder
    settingsPassword?: SortOrder
    updatedAt?: SortOrder
  }

  export type SettingSumOrderByAggregateInput = {
    defaultDepositAmount?: SortOrder
  }

  export type RentalCreateNestedManyWithoutVehicleInput = {
    create?: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput> | RentalCreateWithoutVehicleInput[] | RentalUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutVehicleInput | RentalCreateOrConnectWithoutVehicleInput[]
    createMany?: RentalCreateManyVehicleInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type MaintenanceExpenseCreateNestedManyWithoutVehicleInput = {
    create?: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput> | MaintenanceExpenseCreateWithoutVehicleInput[] | MaintenanceExpenseUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: MaintenanceExpenseCreateOrConnectWithoutVehicleInput | MaintenanceExpenseCreateOrConnectWithoutVehicleInput[]
    createMany?: MaintenanceExpenseCreateManyVehicleInputEnvelope
    connect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
  }

  export type RentalUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput> | RentalCreateWithoutVehicleInput[] | RentalUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutVehicleInput | RentalCreateOrConnectWithoutVehicleInput[]
    createMany?: RentalCreateManyVehicleInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type MaintenanceExpenseUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput> | MaintenanceExpenseCreateWithoutVehicleInput[] | MaintenanceExpenseUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: MaintenanceExpenseCreateOrConnectWithoutVehicleInput | MaintenanceExpenseCreateOrConnectWithoutVehicleInput[]
    createMany?: MaintenanceExpenseCreateManyVehicleInputEnvelope
    connect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RentalUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput> | RentalCreateWithoutVehicleInput[] | RentalUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutVehicleInput | RentalCreateOrConnectWithoutVehicleInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutVehicleInput | RentalUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: RentalCreateManyVehicleInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutVehicleInput | RentalUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutVehicleInput | RentalUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type MaintenanceExpenseUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput> | MaintenanceExpenseCreateWithoutVehicleInput[] | MaintenanceExpenseUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: MaintenanceExpenseCreateOrConnectWithoutVehicleInput | MaintenanceExpenseCreateOrConnectWithoutVehicleInput[]
    upsert?: MaintenanceExpenseUpsertWithWhereUniqueWithoutVehicleInput | MaintenanceExpenseUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: MaintenanceExpenseCreateManyVehicleInputEnvelope
    set?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    disconnect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    delete?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    connect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    update?: MaintenanceExpenseUpdateWithWhereUniqueWithoutVehicleInput | MaintenanceExpenseUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: MaintenanceExpenseUpdateManyWithWhereWithoutVehicleInput | MaintenanceExpenseUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: MaintenanceExpenseScalarWhereInput | MaintenanceExpenseScalarWhereInput[]
  }

  export type RentalUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput> | RentalCreateWithoutVehicleInput[] | RentalUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutVehicleInput | RentalCreateOrConnectWithoutVehicleInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutVehicleInput | RentalUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: RentalCreateManyVehicleInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutVehicleInput | RentalUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutVehicleInput | RentalUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type MaintenanceExpenseUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput> | MaintenanceExpenseCreateWithoutVehicleInput[] | MaintenanceExpenseUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: MaintenanceExpenseCreateOrConnectWithoutVehicleInput | MaintenanceExpenseCreateOrConnectWithoutVehicleInput[]
    upsert?: MaintenanceExpenseUpsertWithWhereUniqueWithoutVehicleInput | MaintenanceExpenseUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: MaintenanceExpenseCreateManyVehicleInputEnvelope
    set?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    disconnect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    delete?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    connect?: MaintenanceExpenseWhereUniqueInput | MaintenanceExpenseWhereUniqueInput[]
    update?: MaintenanceExpenseUpdateWithWhereUniqueWithoutVehicleInput | MaintenanceExpenseUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: MaintenanceExpenseUpdateManyWithWhereWithoutVehicleInput | MaintenanceExpenseUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: MaintenanceExpenseScalarWhereInput | MaintenanceExpenseScalarWhereInput[]
  }

  export type VehicleCreateNestedOneWithoutMaintenanceInput = {
    create?: XOR<VehicleCreateWithoutMaintenanceInput, VehicleUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutMaintenanceInput
    connect?: VehicleWhereUniqueInput
  }

  export type VehicleUpdateOneRequiredWithoutMaintenanceNestedInput = {
    create?: XOR<VehicleCreateWithoutMaintenanceInput, VehicleUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutMaintenanceInput
    upsert?: VehicleUpsertWithoutMaintenanceInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutMaintenanceInput, VehicleUpdateWithoutMaintenanceInput>, VehicleUncheckedUpdateWithoutMaintenanceInput>
  }

  export type RentalCreateNestedManyWithoutCustomerInput = {
    create?: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput> | RentalCreateWithoutCustomerInput[] | RentalUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCustomerInput | RentalCreateOrConnectWithoutCustomerInput[]
    createMany?: RentalCreateManyCustomerInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type RentalUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput> | RentalCreateWithoutCustomerInput[] | RentalUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCustomerInput | RentalCreateOrConnectWithoutCustomerInput[]
    createMany?: RentalCreateManyCustomerInputEnvelope
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
  }

  export type RentalUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput> | RentalCreateWithoutCustomerInput[] | RentalUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCustomerInput | RentalCreateOrConnectWithoutCustomerInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutCustomerInput | RentalUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: RentalCreateManyCustomerInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutCustomerInput | RentalUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutCustomerInput | RentalUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type RentalUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput> | RentalCreateWithoutCustomerInput[] | RentalUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: RentalCreateOrConnectWithoutCustomerInput | RentalCreateOrConnectWithoutCustomerInput[]
    upsert?: RentalUpsertWithWhereUniqueWithoutCustomerInput | RentalUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: RentalCreateManyCustomerInputEnvelope
    set?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    disconnect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    delete?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    connect?: RentalWhereUniqueInput | RentalWhereUniqueInput[]
    update?: RentalUpdateWithWhereUniqueWithoutCustomerInput | RentalUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: RentalUpdateManyWithWhereWithoutCustomerInput | RentalUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: RentalScalarWhereInput | RentalScalarWhereInput[]
  }

  export type CustomerCreateNestedOneWithoutRentalsInput = {
    create?: XOR<CustomerCreateWithoutRentalsInput, CustomerUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutRentalsInput
    connect?: CustomerWhereUniqueInput
  }

  export type VehicleCreateNestedOneWithoutRentalsInput = {
    create?: XOR<VehicleCreateWithoutRentalsInput, VehicleUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutRentalsInput
    connect?: VehicleWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CustomerUpdateOneRequiredWithoutRentalsNestedInput = {
    create?: XOR<CustomerCreateWithoutRentalsInput, CustomerUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutRentalsInput
    upsert?: CustomerUpsertWithoutRentalsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutRentalsInput, CustomerUpdateWithoutRentalsInput>, CustomerUncheckedUpdateWithoutRentalsInput>
  }

  export type VehicleUpdateOneRequiredWithoutRentalsNestedInput = {
    create?: XOR<VehicleCreateWithoutRentalsInput, VehicleUncheckedCreateWithoutRentalsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutRentalsInput
    upsert?: VehicleUpsertWithoutRentalsInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutRentalsInput, VehicleUpdateWithoutRentalsInput>, VehicleUncheckedUpdateWithoutRentalsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RentalCreateWithoutVehicleInput = {
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutRentalsInput
  }

  export type RentalUncheckedCreateWithoutVehicleInput = {
    id?: number
    customerId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalCreateOrConnectWithoutVehicleInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput>
  }

  export type RentalCreateManyVehicleInputEnvelope = {
    data: RentalCreateManyVehicleInput | RentalCreateManyVehicleInput[]
  }

  export type MaintenanceExpenseCreateWithoutVehicleInput = {
    id?: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceExpenseUncheckedCreateWithoutVehicleInput = {
    id?: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceExpenseCreateOrConnectWithoutVehicleInput = {
    where: MaintenanceExpenseWhereUniqueInput
    create: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput>
  }

  export type MaintenanceExpenseCreateManyVehicleInputEnvelope = {
    data: MaintenanceExpenseCreateManyVehicleInput | MaintenanceExpenseCreateManyVehicleInput[]
  }

  export type RentalUpsertWithWhereUniqueWithoutVehicleInput = {
    where: RentalWhereUniqueInput
    update: XOR<RentalUpdateWithoutVehicleInput, RentalUncheckedUpdateWithoutVehicleInput>
    create: XOR<RentalCreateWithoutVehicleInput, RentalUncheckedCreateWithoutVehicleInput>
  }

  export type RentalUpdateWithWhereUniqueWithoutVehicleInput = {
    where: RentalWhereUniqueInput
    data: XOR<RentalUpdateWithoutVehicleInput, RentalUncheckedUpdateWithoutVehicleInput>
  }

  export type RentalUpdateManyWithWhereWithoutVehicleInput = {
    where: RentalScalarWhereInput
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyWithoutVehicleInput>
  }

  export type RentalScalarWhereInput = {
    AND?: RentalScalarWhereInput | RentalScalarWhereInput[]
    OR?: RentalScalarWhereInput[]
    NOT?: RentalScalarWhereInput | RentalScalarWhereInput[]
    id?: IntFilter<"Rental"> | number
    customerId?: StringFilter<"Rental"> | string
    vehicleId?: StringFilter<"Rental"> | string
    pickupDate?: DateTimeFilter<"Rental"> | Date | string
    returnDate?: DateTimeNullableFilter<"Rental"> | Date | string | null
    depositAmount?: FloatFilter<"Rental"> | number
    selectedPackage?: StringFilter<"Rental"> | string
    notes?: StringNullableFilter<"Rental"> | string | null
    status?: StringFilter<"Rental"> | string
    totalHours?: FloatNullableFilter<"Rental"> | number | null
    totalAmount?: FloatNullableFilter<"Rental"> | number | null
    settlementAmount?: FloatNullableFilter<"Rental"> | number | null
    isAccident?: BoolFilter<"Rental"> | boolean
    createdAt?: DateTimeFilter<"Rental"> | Date | string
    updatedAt?: DateTimeFilter<"Rental"> | Date | string
  }

  export type MaintenanceExpenseUpsertWithWhereUniqueWithoutVehicleInput = {
    where: MaintenanceExpenseWhereUniqueInput
    update: XOR<MaintenanceExpenseUpdateWithoutVehicleInput, MaintenanceExpenseUncheckedUpdateWithoutVehicleInput>
    create: XOR<MaintenanceExpenseCreateWithoutVehicleInput, MaintenanceExpenseUncheckedCreateWithoutVehicleInput>
  }

  export type MaintenanceExpenseUpdateWithWhereUniqueWithoutVehicleInput = {
    where: MaintenanceExpenseWhereUniqueInput
    data: XOR<MaintenanceExpenseUpdateWithoutVehicleInput, MaintenanceExpenseUncheckedUpdateWithoutVehicleInput>
  }

  export type MaintenanceExpenseUpdateManyWithWhereWithoutVehicleInput = {
    where: MaintenanceExpenseScalarWhereInput
    data: XOR<MaintenanceExpenseUpdateManyMutationInput, MaintenanceExpenseUncheckedUpdateManyWithoutVehicleInput>
  }

  export type MaintenanceExpenseScalarWhereInput = {
    AND?: MaintenanceExpenseScalarWhereInput | MaintenanceExpenseScalarWhereInput[]
    OR?: MaintenanceExpenseScalarWhereInput[]
    NOT?: MaintenanceExpenseScalarWhereInput | MaintenanceExpenseScalarWhereInput[]
    id?: StringFilter<"MaintenanceExpense"> | string
    vehicleId?: StringFilter<"MaintenanceExpense"> | string
    date?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    amount?: FloatFilter<"MaintenanceExpense"> | number
    remarks?: StringNullableFilter<"MaintenanceExpense"> | string | null
    createdAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
    updatedAt?: DateTimeFilter<"MaintenanceExpense"> | Date | string
  }

  export type VehicleCreateWithoutMaintenanceInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutMaintenanceInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    rentals?: RentalUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutMaintenanceInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutMaintenanceInput, VehicleUncheckedCreateWithoutMaintenanceInput>
  }

  export type VehicleUpsertWithoutMaintenanceInput = {
    update: XOR<VehicleUpdateWithoutMaintenanceInput, VehicleUncheckedUpdateWithoutMaintenanceInput>
    create: XOR<VehicleCreateWithoutMaintenanceInput, VehicleUncheckedCreateWithoutMaintenanceInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutMaintenanceInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutMaintenanceInput, VehicleUncheckedUpdateWithoutMaintenanceInput>
  }

  export type VehicleUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rentals?: RentalUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type RentalCreateWithoutCustomerInput = {
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicle: VehicleCreateNestedOneWithoutRentalsInput
  }

  export type RentalUncheckedCreateWithoutCustomerInput = {
    id?: number
    vehicleId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalCreateOrConnectWithoutCustomerInput = {
    where: RentalWhereUniqueInput
    create: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput>
  }

  export type RentalCreateManyCustomerInputEnvelope = {
    data: RentalCreateManyCustomerInput | RentalCreateManyCustomerInput[]
  }

  export type RentalUpsertWithWhereUniqueWithoutCustomerInput = {
    where: RentalWhereUniqueInput
    update: XOR<RentalUpdateWithoutCustomerInput, RentalUncheckedUpdateWithoutCustomerInput>
    create: XOR<RentalCreateWithoutCustomerInput, RentalUncheckedCreateWithoutCustomerInput>
  }

  export type RentalUpdateWithWhereUniqueWithoutCustomerInput = {
    where: RentalWhereUniqueInput
    data: XOR<RentalUpdateWithoutCustomerInput, RentalUncheckedUpdateWithoutCustomerInput>
  }

  export type RentalUpdateManyWithWhereWithoutCustomerInput = {
    where: RentalScalarWhereInput
    data: XOR<RentalUpdateManyMutationInput, RentalUncheckedUpdateManyWithoutCustomerInput>
  }

  export type CustomerCreateWithoutRentalsInput = {
    id?: string
    name: string
    mobileNumber: string
    email?: string | null
    address?: string | null
    idProofType: string
    idProofNumber: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerUncheckedCreateWithoutRentalsInput = {
    id?: string
    name: string
    mobileNumber: string
    email?: string | null
    address?: string | null
    idProofType: string
    idProofNumber: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutRentalsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutRentalsInput, CustomerUncheckedCreateWithoutRentalsInput>
  }

  export type VehicleCreateWithoutRentalsInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    maintenance?: MaintenanceExpenseCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutRentalsInput = {
    id?: string
    vehicleNumber: string
    vehicleName: string
    vehicleType: string
    hourlyRate: number
    securityDeposit: number
    rate1hr?: number | null
    rate3hr?: number | null
    rate6hr?: number | null
    rate12hr?: number | null
    rate24hr?: number | null
    description?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    maintenance?: MaintenanceExpenseUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutRentalsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutRentalsInput, VehicleUncheckedCreateWithoutRentalsInput>
  }

  export type CustomerUpsertWithoutRentalsInput = {
    update: XOR<CustomerUpdateWithoutRentalsInput, CustomerUncheckedUpdateWithoutRentalsInput>
    create: XOR<CustomerCreateWithoutRentalsInput, CustomerUncheckedCreateWithoutRentalsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutRentalsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutRentalsInput, CustomerUncheckedUpdateWithoutRentalsInput>
  }

  export type CustomerUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    mobileNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    idProofType?: StringFieldUpdateOperationsInput | string
    idProofNumber?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleUpsertWithoutRentalsInput = {
    update: XOR<VehicleUpdateWithoutRentalsInput, VehicleUncheckedUpdateWithoutRentalsInput>
    create: XOR<VehicleCreateWithoutRentalsInput, VehicleUncheckedCreateWithoutRentalsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutRentalsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutRentalsInput, VehicleUncheckedUpdateWithoutRentalsInput>
  }

  export type VehicleUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maintenance?: MaintenanceExpenseUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutRentalsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleNumber?: StringFieldUpdateOperationsInput | string
    vehicleName?: StringFieldUpdateOperationsInput | string
    vehicleType?: StringFieldUpdateOperationsInput | string
    hourlyRate?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    rate1hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate3hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate6hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate12hr?: NullableFloatFieldUpdateOperationsInput | number | null
    rate24hr?: NullableFloatFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maintenance?: MaintenanceExpenseUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type RentalCreateManyVehicleInput = {
    id?: number
    customerId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MaintenanceExpenseCreateManyVehicleInput = {
    id?: string
    date: Date | string
    amount: number
    remarks?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateWithoutVehicleInput = {
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutRentalsNestedInput
  }

  export type RentalUncheckedUpdateWithoutVehicleInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalUncheckedUpdateManyWithoutVehicleInput = {
    id?: IntFieldUpdateOperationsInput | number
    customerId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceExpenseUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: FloatFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalCreateManyCustomerInput = {
    id?: number
    vehicleId: string
    pickupDate: Date | string
    returnDate?: Date | string | null
    depositAmount: number
    selectedPackage?: string
    notes?: string | null
    status?: string
    totalHours?: number | null
    totalAmount?: number | null
    settlementAmount?: number | null
    isAccident?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RentalUpdateWithoutCustomerInput = {
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutRentalsNestedInput
  }

  export type RentalUncheckedUpdateWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicleId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RentalUncheckedUpdateManyWithoutCustomerInput = {
    id?: IntFieldUpdateOperationsInput | number
    vehicleId?: StringFieldUpdateOperationsInput | string
    pickupDate?: DateTimeFieldUpdateOperationsInput | Date | string
    returnDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    depositAmount?: FloatFieldUpdateOperationsInput | number
    selectedPackage?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    totalHours?: NullableFloatFieldUpdateOperationsInput | number | null
    totalAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    settlementAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    isAccident?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}