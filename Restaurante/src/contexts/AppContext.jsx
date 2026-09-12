import { createContext, useContext } from 'react';
import { useAppController } from '../controllers/useAppController.js';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // O Controller é instanciado uma vez; todas as telas recebem o mesmo carrinho.
  const controlador = useAppController();
  return <AppContext.Provider value={controlador}>{children}</AppContext.Provider>;
}

export function useApp() {
  const contexto = useContext(AppContext);
  if (!contexto) throw new Error('useApp precisa estar dentro de AppProvider.');
  return contexto;
}
