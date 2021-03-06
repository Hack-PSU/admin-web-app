import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { WithChildren } from "types/common";
import { useImmer } from "use-immer";

type ModalHooks = {
  show: boolean;
};

type ModalState = {
  [key: string]: ModalHooks;
};

type UseModalReturn = ModalHooks & {
  handleHide(): void;
  handleShow(): void;
};

interface IModalProviderHooks {
  showModal(name: string): void;
  register(name: string): void;
  handleHide(name: string): void;
  getState(name: string): boolean | null;
}

const ModalContext = createContext<IModalProviderHooks>(
  {} as IModalProviderHooks
);

const ModalProvider: FC<WithChildren> = ({ children }) => {
  const [modalState, setModalState] = useImmer<ModalState>({});

  const showModal = useCallback(
    (name: string) => {
      setModalState((draft) => {
        draft[name].show = true;
      });
    },
    [setModalState]
  );

  const register = useCallback(
    (name: string) => {
      setModalState((draft) => {
        draft[name] = {
          show: false,
        };
      });
    },
    [setModalState]
  );

  const handleHide = useCallback(
    (name: string) => {
      setModalState((draft) => {
        draft[name].show = false;
      });
    },
    [setModalState]
  );

  const getState = useCallback(
    (name: string) => {
      if (name in modalState) {
        return modalState[name].show;
      }
      return null;
    },
    [modalState]
  );

  const value = useMemo(
    () => ({
      showModal,
      register,
      handleHide,
      getState,
    }),
    [showModal, register, handleHide, getState]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);

export function useModal(name: string): UseModalReturn {
  const {
    getState,
    handleHide: hideModal,
    register,
    showModal,
  } = useModalContext();

  useEffect(() => {
    register(name);
  }, [name, register]);

  return {
    show: getState(name) ?? false,
    handleHide() {
      hideModal(name);
    },
    handleShow() {
      showModal(name);
    },
  };
}

export default ModalProvider;
