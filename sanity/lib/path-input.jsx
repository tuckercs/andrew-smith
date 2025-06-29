// /components/MyCustomStringInput.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Box, Flex, Text, TextInput, Spinner, Stack } from '@sanity/ui';
import { set, unset, useClient, useFormValue } from 'sanity';
import * as PathUtils from '@sanity/util/paths';
import * as urlSlug from 'url-slug';
import groq from 'groq';

export const PathInput = (props) => {
  const { elementProps, onChange, path, schemaType, value = '' } = props;

  const isSlug = schemaType?.name === 'slug';
  const subPath = schemaType?.options?.subPath;
  const [pathDomain, setPathDomain] = useState();
  const sanityClient = useClient({ apiVersion: '2023-01-01' });
  const document = useFormValue([]);

  const handleStringOnChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  const handleSlugOnChange = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value
        ? Object.assign({
            _type: schemaType?.name || 'slug',
            current: event.currentTarget.value,
          })
        : undefined;

      onChange(nextValue ? set(nextValue) : unset());
    },
    [schemaType, onChange]
  );

  const handleSlugOnBlur = useCallback(
    (event) => {
      const nextValue = event.currentTarget.value;

      if (nextValue) {
        const nextValueSlug = Object.assign({
          _type: schemaType?.name || 'slug',
          current: nextValue
            .split('/')
            .filter((segment) => !!segment)
            .map((segment) => urlSlug.convert(segment, { camelCase: false }))
            .join('/'),
        });

        if (nextValueSlug?.current !== value?.current) {
          onChange(set(nextValueSlug));
        }
      } else {
        onChange(unset());
      }
    },
    [schemaType, onChange, value]
  );

  const handleGenerateSlug = useCallback(async () => {
    // bail if no document is found
    if (!document) return;

    // determine our parent field + path
    const parentPath = path.slice(0, -1);
    const parent = PathUtils.get(document, parentPath);

    // get the source value
    const sourceValue = await Promise.resolve(
      typeof schemaType?.options?.source === 'function'
        ? schemaType?.options?.source(document, { parentPath, parent })
        : PathUtils.get(document, schemaType?.options?.source || [])
    );

    // slugify and set the source value
    if (typeof sourceValue === 'string') {
      const nextValueSlug = Object.assign({
        _type: schemaType?.name || 'slug',
        current: urlSlug.convert(sourceValue, { camelCase: false }),
      });

      onChange(set(nextValueSlug));
    } else {
      onChange(unset());
    }
  }, [schemaType, onChange, document, path]);

  useEffect(() => {
    const getPathDomain = async () => {
      const liveSiteUrl = await sanityClient.fetch(groq`
        *[_type == "generalSettings"][0].liveSiteDomain
      `);

      const liveSiteDomain = new URL(liveSiteUrl).hostname.replace('www.', '');

      setPathDomain(liveSiteDomain);
    };

    if (!pathDomain) getPathDomain();
  });

  return (
    <Stack space={3}>
      <Flex>
        <Box flex={1}>
          <TextInput
            {...elementProps}
            onChange={isSlug ? handleSlugOnChange : handleStringOnChange}
            {...(isSlug ? { onBlur: handleSlugOnBlur } : {})}
            value={isSlug ? value?.current : value}
            readOnly={props.readOnly}
            prefix={
              <Box padding={3}>
                {pathDomain ? (
                  <Text size={2} muted>
                    {pathDomain}/{subPath ? `${subPath}/` : ''}
                  </Text>
                ) : (
                  <Flex justify="center" paddingX={6}>
                    <Spinner muted />
                  </Flex>
                )}
              </Box>
            }
          />
        </Box>

        {isSlug && (
          <Box marginLeft={1}>
            <Button
              mode="ghost"
              type="button"
              disabled={props.readOnly}
              onClick={handleGenerateSlug}
              // text={generateState?.status === 'pending' ? 'Generating…' : 'Generate'}
              text="Generate"
            />
          </Box>
        )}
      </Flex>
    </Stack>
  );
};
