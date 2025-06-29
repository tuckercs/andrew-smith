import React, { useCallback } from 'react';
import { TextArea, studioTheme, ThemeProvider } from '@sanity/ui';
import { set, unset } from 'sanity';

export const CodeInput = (props) => {
  const { elementProps, schemaType, onChange, value = '' } = props;

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <ThemeProvider scheme="dark" theme={studioTheme}>
      <TextArea
        {...elementProps}
        rows={schemaType?.rows}
        onChange={handleChange}
        value={value}
        style={{
          fontFamily: 'monospace',
        }}
      />
    </ThemeProvider>
  );
};
