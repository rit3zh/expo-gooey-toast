import type {
  IToastivaData,
  IToastivaOptions,
  TToastUpdateOptions,
  TToastsListener,
} from "../typings";
import {
  notifyHeights,
  notifyToastUpdate,
  notifyToasts,
  storeState,
  toastUpdateListeners,
  toastsListeners,
} from "./state";

function addToast<T extends IToastivaOptions>(options: Partial<T>): string {
  const id = `gooey-${++storeState.idCounter}`;
  const toast: IToastivaData = {
    id,
    title: options.title!,
    description: options.description,
    type: options.type ?? "default",
    animation: options.animation,
    animationPreset: options.animationPreset,
    position: options.position,
    action: options.action,
    bodyLayout: options.bodyLayout,
    bodyRadius: options.bodyRadius,
    cornerSmoothing: options.cornerSmoothing,
    disableIOSBlur: options.disableIOSBlur,
    expandedHeight: options.expandedHeight,
    expandedWidth: options.expandedWidth,
    horizontalInset: options.horizontalInset,
    icon: options.icon,
    iosBlurTint: options.iosBlurTint,
    isLoading: options.isLoading,
    meta: options.meta,
    duration: options.duration ?? storeState.defaultDuration,
    fill: options.fill,
    timing: options.timing,
    dismissible: options.dismissible ?? true,
    createdAt: Date.now(),
    onDismiss: options.onDismiss,
    onAutoClose: options.onAutoClose,
    showHeader: options.showHeader,
    showIcon: options.showIcon,
    showIconBadge: options.showIconBadge,
    showTimestamp: options.showTimestamp,
    showProgress: options.showProgress,
    springConfig: options.springConfig,
    stroke: options.stroke,
    styles: options.styles,
    content: options.content,
    headerContent: options.headerContent,
  };
  storeState.toasts = [toast, ...storeState.toasts];
  void notifyToasts();
  return id;
}

function removeToast<T extends string>(id: T) {
  storeState.toasts = storeState.toasts.filter((toast) => toast.id !== id);
  storeState.heights = storeState.heights.filter(
    (entry) => entry.toastId !== id,
  );
  toastUpdateListeners.delete(id);
  void notifyToasts();
  void notifyHeights();
}

function updateToast<T extends string, U extends TToastUpdateOptions>(
  id: T,
  options: U,
) {
  const index = storeState.toasts.findIndex((toast) => toast.id === id);
  if (index < 0) return false;

  const current = storeState.toasts[index];
  const nextToast: IToastivaData = {
    ...current,
    ...options,
    id: current.id,
    createdAt: current.createdAt,
    title: options.title ?? current.title,
    type: options.type ?? current.type,
    duration: options.duration ?? current.duration,
    isLoading: options.isLoading ?? current.isLoading,
    timing: options.timing ?? current.timing,
    dismissible: options.dismissible ?? current.dismissible,
  };

  storeState.toasts = storeState.toasts?.map!((toast) =>
    toast.id === id ? nextToast : toast,
  );
  void notifyToastUpdate(id, options);
  void notifyToasts();

  return true;
}

function dismissAll(): void {
  storeState.toasts = [];
  storeState.heights = [];
  void notifyToasts();
  void notifyHeights();
}

function setDefaultDuration<T extends number>(duration: T) {
  storeState.defaultDuration = duration;
}

function subscribeToasts<T extends TToastsListener>(listener: T) {
  toastsListeners.add(listener);
  return () => toastsListeners.delete(listener);
}

function subscribeToastUpdates<
  T extends string,
  L extends (options: TToastUpdateOptions) => void,
>(id: T, listener: L) {
  const listeners = toastUpdateListeners.get(id) ?? new Set();
  listeners.add(listener);
  toastUpdateListeners.set(id, listeners);
  return () => {
    const currentListeners = toastUpdateListeners.get(id);
    if (!currentListeners) return;
    currentListeners.delete(listener);
    if (!currentListeners.size) toastUpdateListeners.delete(id);
  };
}

function getToasts() {
  return storeState.toasts;
}

export {
  addToast,
  dismissAll,
  getToasts,
  removeToast,
  setDefaultDuration,
  subscribeToastUpdates,
  subscribeToasts,
  updateToast,
};
