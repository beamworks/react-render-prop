// ------------------------------------
// public types (exposed as index.d.ts)
// ------------------------------------

// render-prop callback (always returns an element, which happens to be
// our collector instance)
export type PropCallback<Args extends unknown[]> = (
  ...renderPropArgs: Args
) => React.ReactElement;

// hook return value (tuple with first element always being the prop callback value
// and the subsequent elements being the collected arguments or undefined)
// @todo eventually switch to variadic tuples in TS 4.0
export type PropHookReturn<Args> = Args extends [infer A]
  ? [PropCallback<Args>, A?]
  : Args extends [infer A, infer B]
  ? [PropCallback<Args>, A?, B?]
  : Args extends [infer A, infer B, infer C]
  ? [PropCallback<Args>, A?, B?, C?]
  : Args extends [infer A, infer B, infer C, infer D]
  ? [PropCallback<Args>, A?, B?, C?, D?]
  : Args extends [infer A, infer B, infer C, infer D, infer E]
  ? [PropCallback<Args>, A?, B?, C?, D?, E?]
  : Args extends [infer A, infer B, infer C, infer D, infer E, infer F]
  ? [PropCallback<Args>, A?, B?, C?, D?, E?, F?]
  : Args extends [infer A, infer B, infer C, infer D, infer E, infer F, infer G]
  ? [PropCallback<Args>, A?, B?, C?, D?, E?, F?, G?]
  : Args extends [
      infer A,
      infer B,
      infer C,
      infer D,
      infer E,
      infer F,
      infer G,
      infer H
    ]
  ? [PropCallback<Args>, A?, B?, C?, D?, E?, F?, G?, H?]
  : never;

// main hook function signature
export declare function useRenderProp<Args extends unknown[]>(): PropHookReturn<
  Args
>;
