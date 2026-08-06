# Usage

<sub><a href="./README.md">← Docs</a></sub>

---

## Provider

Wrap your app root with `GestureHandlerRootView`, then render `ToastivaProvider` inside your safe area provider. Toastiva does not add the gesture root for you.

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastivaProvider } from "toastiva";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastivaProvider position="top-center">
          <RootNavigator />
        </ToastivaProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## Triggering toasts

```tsx
import { toastiva } from "toastiva";

toastiva.success("Saved", { description: "Your changes are ready." });
toastiva.error("Couldn't save", { description: "Try again in a moment." });
toastiva.info("New version available");
toastiva.warning("Battery low");
```

## Singleton toasts

Pass `singleton: true` to skip creating a new toast when one is already open. Unlike morph mode (which replaces the current toast), this ignores new calls until the current toast closes.

```tsx
toastiva.error("Couldn't save", { singleton: true });
```

## Custom content

```tsx
toastiva.custom(({ id }) => (
  <MyCustomToast onClose={() => toastiva.dismiss(id)} />
));
```

## Promises

```tsx
toastiva.promise(uploadFile(file), {
  loading: "Uploading…",
  success: (res) => `Uploaded ${res.name}`,
  error: (err) => `Failed: ${err.message}`,
});
```

## Updating &amp; dismissing

```tsx
const id = toastiva.info("Working…");

toastiva.update(id, { title: "Almost there" });
toastiva.dismiss(id);
toastiva.dismissAll();
```

> [!NOTE]
> All methods return a stable `id` you can pass to `update` or `dismiss`.

---

<sub>Next: <a href="./styling.md">Styling →</a></sub>
