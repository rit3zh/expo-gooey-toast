import { SpinnerIcon } from "../icons";
import type {
  IToastivaOptions,
  IToastivaPromiseData,
  IToastivaPromiseUpdate,
  TToastUpdateOptions,
} from "../typings";
import { createElement, type ReactNode } from "react";
import { getPromiseSettledDuration } from "../utils/toast-timing";
import { getHeights, subscribeHeights, updateHeight } from "./heights";
import {
  addToast,
  dismissAll,
  getToasts,
  removeToast,
  setDefaultDuration,
  subscribeToastUpdates,
  subscribeToasts,
  updateToast,
} from "./toasts";

const PROMISE_PENDING_DURATION = 60 * 60 * 1000;

function resolveMessage<T>(value: string | ((result: T) => string), input: T) {
  return typeof value === "function" ? value(input) : value;
}

function resolveDescription<T>(
  value: string | ((result: T) => string | undefined) | undefined,
  input: T,
) {
  if (!value) return undefined;
  return typeof value === "function" ? value(input) : value;
}

function createPromiseToast<TResult, TError = unknown>(
  promise: Promise<TResult>,
  data: IToastivaPromiseData<TResult, TError>,
) {
  const loadingTiming = data.timing
    ? {
        ...data.timing,
        displayDuration: undefined,
      }
    : undefined;
  const id = addToast<IToastivaOptions>({
    action: undefined,
    animation: data.animation,
    animationPreset: data.animationPreset,
    bodyLayout: data.bodyLayout,
    bodyRadius: data.bodyRadius,
    cornerSmoothing: data.cornerSmoothing,
    description: data.description?.loading,
    disableIOSBlur: data.disableIOSBlur,
    dismissible: false,
    duration: PROMISE_PENDING_DURATION,
    expandedHeight: data.expandedHeight,
    expandedWidth: data.expandedWidth,
    fill: data.fill,
    horizontalInset: data.horizontalInset,
    icon:
      data.icon?.loading ??
      createElement(SpinnerIcon, { color: "#3b82f6", size: 16 }),
    iosBlurTint: data.iosBlurTint,
    isLoading: true,
    meta: data.meta,
    onAutoClose: data.onAutoClose,
    onDismiss: data.onDismiss,
    position: data.position,
    showIcon: data.showIcon,
    showIconBadge: data.showIconBadge,
    showTimestamp: data.showTimestamp,
    springConfig: data.springConfig,
    stroke: data.stroke,
    styles: data.styles,
    timing: loadingTiming,
    title: data.loading,
    type: "info",
  });

  promise
    .then((result) => {
      settlePromiseToast(id, data, {
        action: data.action?.success,
        description: resolveDescription(data.description?.success, result),
        icon: data.icon?.success,
        title: resolveMessage(data.success, result),
        type: "success",
      });
    })
    .catch((error: TError) => {
      settlePromiseToast(id, data, {
        action: data.action?.error,
        description: resolveDescription(data.description?.error, error),
        icon: data.icon?.error,
        title: resolveMessage(data.error, error),
        type: "error",
      });
    });

  return id;
}

function settlePromiseToast<TResult, TError = unknown>(
  id: string,
  data: IToastivaPromiseData<TResult, TError>,
  next: IToastivaPromiseUpdate,
) {
  const settledDuration = getPromiseSettledDuration(data);
  updateToast(id, {
    action: next.action,
    description: next.description,
    dismissible: true,
    duration: settledDuration,
    icon: next.icon,
    isLoading: false,
    timing: data.timing,
    title: next.title,
    type: next.type,
  });
}

const toastiva = Object.assign(
  (title: string, options?: Omit<IToastivaOptions, "title">) =>
    addToast({ title, ...options }),
  {
    success: (
      title: string,
      options?: Omit<IToastivaOptions, "title" | "type">,
    ) => addToast({ title, type: "success", ...options }),
    error: (
      title: string,
      options?: Omit<IToastivaOptions, "title" | "type">,
    ) => addToast({ title, type: "error", ...options }),
    warning: (
      title: string,
      options?: Omit<IToastivaOptions, "title" | "type">,
    ) => addToast({ title, type: "warning", ...options }),
    info: (title: string, options?: Omit<IToastivaOptions, "title" | "type">) =>
      addToast({ title, type: "info", ...options }),
    update: (id: string, options: TToastUpdateOptions) =>
      updateToast(id, options),
    promise: <TResult, TError = unknown>(
      promise: Promise<TResult>,
      data: IToastivaPromiseData<TResult, TError>,
    ) => createPromiseToast(promise, data),
    dismiss: removeToast,
    dismissAll,
    custom: (
      content: ReactNode,
      options?: Partial<Omit<IToastivaOptions, "content">>,
    ) =>
      addToast({
        title: options?.title ?? "",
        type: options?.type ?? "default",
        ...options,
        content,
      }),
  },
);

export {
  dismissAll,
  getHeights,
  getToasts,
  removeToast,
  setDefaultDuration,
  subscribeHeights,
  subscribeToastUpdates,
  subscribeToasts,
  toastiva,
  updateHeight,
  updateToast,
};
