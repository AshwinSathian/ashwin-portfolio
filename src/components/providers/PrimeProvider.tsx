'use client';

import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

type Props = { children: React.ReactNode };

export default function PrimeProvider({ children }: Props) {
  return (
    <PrimeReactProvider
      value={{
        ripple: true,
        inputStyle: 'outlined',
        unstyled: false,
        // Ensure overlays (menus, dialogs, tooltips) attach to body for correct stacking context
        // Components that accept appendTo should default to document.body via this function:
        // but for newer PrimeReact, per-component props are preferred; keep default behavior.
      }}
    >
      {children}
    </PrimeReactProvider>
  );
}
