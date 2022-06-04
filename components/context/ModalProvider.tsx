import {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { WithChildren } from "types/common";
import { useImmer } from "use-immer";
import produce from "immer";

type ModalHooks = {
  show: boolean;
};

type ModalState = {
  [key: string]: ModalHooks;
};

type UseModalReturn = ModalHooks & {
  handleHide(): void;
};

interface IModalProviderHooks {
  showModal(name: string): void;
  register(name: string): void;
  handleHide(name: string): void;
  modalState: ModalState;
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

  const value = useMemo(
    () => ({
      showModal,
      register,
      handleHide,
      modalState,
    }),
    [showModal, register, handleHide, modalState]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);

export function useModal(name: string): UseModalReturn {
  const { modalState, handleHide: hideModal, register } = useModalContext();

  useEffect(() => {
    register(name);
  }, [name, register]);

  return {
    show: name in modalState ? modalState[name].show : false,
    handleHide() {
      hideModal(name);
    },
  };
}

export default ModalProvider;
