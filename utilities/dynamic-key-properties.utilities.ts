import { useState } from "react";
import { Writable } from "ts-toolbelt/out/List/Writable";
import { Join } from "ts-toolbelt/out/String/Join";

type ForceCapitalize<T extends string> = Capitalize<Lowercase<T>>;

const capitalize = <T extends string>(text: T): ForceCapitalize<T> => {
  return (text.charAt(0).toLocaleUpperCase() +
    text.substring(1).toLocaleLowerCase()) as ForceCapitalize<T>;
};

const usePrimitiveModal = () => {
  // just as an example
  const [visible, setVisibility] = useState(false);

  return {
    close: () => setVisibility(true),
    open: () => setVisibility(true),
    visible,
  };
};

type TModalSuffix<T extends boolean> = T extends true ? "Modal" : "";

const inferUseModalTyping = <TName extends string, TModal extends boolean>(
  name: TName,
  modal: TModal
) => {
  const { close, open, visible } = usePrimitiveModal();

  const modalSuffix = modal ? "Modal" : "";

  const openKey =
    `open${name}${modalSuffix}` as `open${TName}${TModalSuffix<TModal>}`;
  const closeKey =
    `close${name}${modalSuffix}` as `close${TName}${TModalSuffix<TModal>}`;
  const visibleKey =
    `is${name}${modalSuffix}Visible` as `is${TName}${TModalSuffix<TModal>}Visible`;

  type ModalHookResponse = {
    [k in typeof openKey]: () => void;
  } & {
    [k in typeof closeKey]: () => void;
  } & {
    [k in typeof visibleKey]: boolean;
  };

  return {
    [openKey]: open,
    [closeKey]: close,
    [visibleKey]: visible,
  } as {
    [k in keyof ModalHookResponse]: ModalHookResponse[k];
  };
};

const useModal = <T extends string, TModal extends boolean>(
  name: T,
  modal: TModal
) => {
  const capitalized = capitalize(name);

  return inferUseModalTyping(capitalized, modal);
};

const saveModal = useModal("save", true);
const {
  closeReservationModal,
  isReservationModalVisible,
  openReservationModal,
} = useModal("reservation", true);
const { closeRetry, isRetryVisible, openRetry } = useModal("retry", false);
// @ts-expect-error
const { closeSave, isSaveVisible, openSave } = useModal("save", true);

// const { close, visible, open } = useModal("", false)
type Magic = ReturnType<typeof useModal<"refining", true>>;
type DefaultMagic = ReturnType<typeof useModal<"", false>>;

// TODO: work with array of strings, not to lose camelCase formatting
// BookingTableConfirmation would be lost as it is

const capitalizeArray = <T extends readonly string[]>(words: T) => {
  return words.map((word) => capitalize(word)) as {
    [k in keyof T]: ForceCapitalize<T[k]>;
  };
};

const joinStringArray = <T extends readonly string[], TSep extends string>(
  array: T,
  separator: TSep
) => {
  return array.join(separator) as Join<Writable<T>, "">;
};

const useModalArray = <T extends readonly string[], TModal extends boolean>(
  keys: T,
  modal: TModal
) => {
  const capitalized = capitalizeArray(keys);
  const joined = joinStringArray(capitalized, "");

  return inferUseModalTyping(joined, modal);
};

const bookingTableConfirmation = useModalArray(
  ["booking", "tAble", "confirmAtion"] as const,
  true
);

const {
  closeMultipleKeysModal,
  isMultipleKeysModalVisible,
  openMultipleKeysModal,
} = useModalArray(["multiple", "keys"] as const, true);

const {} = useModalArray(["without", "as", "const"], true);
