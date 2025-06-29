import React from 'react'
import { Flex, Text, Switch, Box, Stack } from '@sanity/ui'

const customBoolean = React.forwardRef(function customBoolean(
  { value, onChange, schemaType, readOnly },
  ref,
) {
  return (
    <Stack space={2} padding={2} style={{ borderBottom: '1px solid #eee' }}>
      <Flex align="center" justify="space-between">
        <Box>
          <Text size={1} weight="medium">
            {schemaType.title}
          </Text>
          {schemaType.description && (
            <Text size={1} muted style={{ marginTop: '8px' }}>
              {schemaType.description}
            </Text>
          )}
        </Box>
        <Switch
          ref={ref}
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={readOnly}
          style={{ transform: 'scale(1.15)' }}
        />
      </Flex>
    </Stack>
  )
})

export { customBoolean }
