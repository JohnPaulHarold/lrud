import React, { useState, useEffect } from 'react';
import createFocusStore from './focus-store';
import lrudInput from './lrud-input/focus-lrud';
import { ProviderValue, RootFocusNode, Orientation } from './types';
import warning from './utils/warning';

const FocusContext = React.createContext<null | ProviderValue>(null);

function FocusProviderWrapper({
  orientation,
  wrapping,
  children,
}: {
  children?: React.ReactNode;
  orientation?: Orientation;
  wrapping?: boolean;
}) {
  const [providerValue] = useState<ProviderValue>(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (
        orientation !== undefined &&
        orientation !== 'vertical' &&
        orientation !== 'horizontal'
      ) {
        warning(
          'An invalid orientation was passed to the FocusRoot. The orientation must either be "vertical" or "horizontal."',
          'INVALID_ROOT_ORIENTATION'
        );
      }
    }

    const store = createFocusStore({
      orientation,
      wrapping,
    });

    return {
      store,
      focusDefinitionHierarchy: [
        {
          focusId: 'root',
        },
      ],
      focusNodesHierarchy: [store.getState().nodes.root as RootFocusNode],
    };
  });

  useEffect(() => {
    const lrud = lrudInput(providerValue.store);
    lrud.subscribe();

    return () => {
      lrud.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FocusContext.Provider value={providerValue}>
      {children}
    </FocusContext.Provider>
  );
}

export default {
  Context: FocusContext,
  FocusRoot: FocusProviderWrapper,
};
