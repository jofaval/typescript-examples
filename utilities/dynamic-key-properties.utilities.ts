import { useState } from "react";

const capitalize = <T extends string>(text: T): Capitalize<T> => {
  return (text.charAt(0).toLocaleUpperCase() +
    text.substring(1).toLocaleLowerCase()) as Capitalize<T>;
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

const useModal = <T extends string, TModal extends boolean>(
  name: T,
  modal: TModal
) => {
  const { close, open, visible } = usePrimitiveModal();

  const capitalized = capitalize(name);
  const modalSuffix: "Modal" | "" = modal ? "Modal" : "";

  const openKey =
    `open${capitalized}${modalSuffix}` as `open${Capitalize<T>}${TModalSuffix<TModal>}`;
  const closeKey =
    `close${capitalized}${modalSuffix}` as `close${Capitalize<T>}${TModalSuffix<TModal>}`;
  const visibleKey =
    `is${capitalized}${modalSuffix}Visible` as `is${Capitalize<T>}${TModalSuffix<TModal>}Visible`;

  type ModalHookResponse = { [k in typeof openKey]: typeof open } & {
    [k in typeof closeKey]: typeof close;
  } & { [k in typeof visibleKey]: typeof visible };

  return {
    [openKey]: open,
    [closeKey]: close,
    [visibleKey]: visible,
  } as {
    [k in keyof ModalHookResponse]: ModalHookResponse[k];
  };
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
