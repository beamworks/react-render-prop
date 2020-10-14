# react-render-prop

Helper React hook to consume and flatten render-props.

## At a Glance

Sample usage:

```jsx
import { useRenderProp } from 'react-render-prop';

function MyComponent() {
  // valueA and valueB are filled in on next render
  const [libraryWidgetSink, valueA, valueB] = useRenderProp();

  // ... do something with the returned values

  return (
    <LibraryWidget>
      {libraryWidgetSink}
    </LibraryWidget>
  );
}
```

## Rationale

In React code, the render-props pattern is a standard way to let a component pass data to the outside. For example:

```jsx
function MyComponent() {
  return (
    <LibraryWidget>
      {(valueA, valueB) => {
        // ... do something with the returned values

        return <MyContent />;
      }}
    </LibraryWidget>
  );
}
```

However, we often need to "hoist" those returned values back up to the top-level logic of MyComponent. I.e.
after the first render is completed, we want to collect those values exposed to the render-prop body and then
re-render MyComponent - this time with awareness of that returned data.

This library is a convenient helper hook to accomplish that. The hook is invoked with no parameters and returns
an array with the following:

- **render-prop "sink" callback** - insert this where render-prop body would normally go
- **values collected from the "sink"** - whatever the component passes to render-prop body will be exposed here

So, if the render-prop component passes `valueA` and `valueB` to the function, do this:

```jsx
const [libraryWidgetSink, valueA, valueB] = useRenderProp();
```

And then when rendering the render-prop component, pass the "sink" callback to it:

```jsx
<LibraryWidget>
  {libraryWidgetSink}
</LibraryWidget>
```

This works for components that use other kinds of render-props than function-as-a-child:

```jsx
<LibraryWidget someRenderProp={libraryWidgetSink} />
```

The "sink" callback produced by this helper hook will always return a React element. As long as
the component render-prop expects a function that returns React content, you can put that "sink"
in there. Just make sure to not use the same callback in two different spots or inside a loop.

**Infinite render loop warning:** be aware that this hook triggers a re-render any time the
values passed to the "sink" change. If the render-prop component passes a new instance of an
object into the "sink" on every render, then the "sink" will keep scheduling more and more
re-renders of the top-level component, causing an infinite render loop. This can be fixed
via memoization for now, but there is a plan to add a "toDeps" parameter to the hook for
explicit control.
