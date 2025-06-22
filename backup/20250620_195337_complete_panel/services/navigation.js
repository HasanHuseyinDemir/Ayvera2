import { createContextId, useContext, useContextProvider } from '@builder.io/qwik';

// Navigation loading state için context
export const NavigationContext = createContextId('navigation-context');

export const useNavigationProvider = () => {
  const state = {
    isLoading: false,
    startLoading: () => {
      state.isLoading = true;
    },
    stopLoading: () => {
      state.isLoading = false;
    }
  };
  
  useContextProvider(NavigationContext, state);
  return state;
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};
