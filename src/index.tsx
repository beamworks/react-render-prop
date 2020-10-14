import React, {
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react';

import { PropCallback, PropHookReturn } from './exports';

// internal collector instance for callback args
function ArgsCollector<Args extends unknown[]>({
  setter,
  args
}: {
  setter: Dispatch<SetStateAction<Args | undefined>>;
  args: Args;
}) {
  // report args on mount or change
  useEffect(() => {
    setter(args);
  }, [setter, ...args]);

  // clean up on unmount
  useEffect(() => {
    return () => {
      setter(undefined);
    };
  }, [setter]);

  // nothing to return from collector instance
  return null;
}

// the arg values are returned in same array as callback ([callback, ...args] instead of [callback, args])
// in order to simplify the spread expression that consumes this hook's return value
// (args starts out as undefined, and undefined cannot be spread)
export function useRenderProp<Args extends unknown[]>(): PropHookReturn<Args> {
  const [currentArgs, setCurrentArgs] = useState<Args | undefined>(undefined);

  const propCallback = useCallback<PropCallback<Args>>(
    (...args) => <ArgsCollector setter={setCurrentArgs} args={args} />,
    []
  );

  if (currentArgs === undefined) {
    return [propCallback] as PropHookReturn<Args>;
  }

  // @todo consider how to add more type safety
  return [propCallback, ...currentArgs] as PropHookReturn<Args>;
}
