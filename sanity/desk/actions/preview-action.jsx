import React, { useState } from 'react'
import { useClient } from 'sanity'
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  Button,
  Select,
} from '@sanity/ui'
import { CogIcon, EyeOpenIcon } from '@sanity/icons'
import groq from 'groq'

const previewNamespace = 'preview'
const previewConfigKeys = [
  {
    key: 'previewSecret',
    title: 'Secret Key',
    description: 'Used to authenticate preview requests',
  },
]

export const PreviewAction = ({ type, draft, published, onComplete }) => {
  const pageSlug = draft ? draft.slug?.current : published?.slug?.current

  const sanityClient = useClient({ apiVersion: '2023-01-01' })

  const [selectedEnv, setSelectedEnv] = useState('live')
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const onHandleOpenPreview = async (env, secret) => {
    // define our env domain field
    const envDomain = {
      live: 'liveSiteDomain',
      dev: 'devSiteDomain',
    }[env ?? 'live']

    // define our local and remote domains
    const localDomain = 'http://localhost:3000'
    const remoteDomain = await sanityClient.fetch(groq`
      *[_type == "generalSettings"][0].${envDomain}
    `)

    // define preview url based on node_env
    const previewUrl = new URL(
      'api/preview',
      process.env.NODE_ENV === 'development' ? localDomain : remoteDomain,
    )

    // append preview params to preview url
    previewUrl.searchParams.append('secret', secret)
    previewUrl.searchParams.append('type', type)
    previewUrl.searchParams.append('slug', pageSlug || '')

    // open preview URL in a new tab/window
    window.open(previewUrl.href, '_blank')
  }

  return {
    label: 'Preview',
    icon: EyeOpenIcon,
    shortcut: 'mod+shift+p',
    dialog: showPreview && {
      type: 'popover',
      onClose: onComplete,
      header: 'Preview',
      content: (
        <>
          <Card
            tone="transparent"
            borderBottom
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <Flex>
              <Box flex={1} padding={4}>
                <Text weight="semibold">Preview Mode</Text>
              </Box>
              <Box padding={2}>
                <Button
                  aria-label="Preview Settings"
                  icon={CogIcon}
                  mode="bleed"
                  onClick={() => {
                    setShowSettings(true)
                  }}
                  padding={3}
                />
              </Box>
            </Flex>
          </Card>

          {secrets?.previewSecret ? (
            <Stack padding={4} space={2}>
              <Select
                fontSize={2}
                padding={3}
                onChange={(e) => {
                  setSelectedEnv(e.target.value)
                }}
                value={selectedEnv}
              >
                <option value="live">Live</option>
                <option value="dev">Development</option>
              </Select>

              <Grid columns={1}>
                <Button
                  fontSize={2}
                  padding={3}
                  text="Open Preview"
                  tone="positive"
                  onClick={() =>
                    onHandleOpenPreview(selectedEnv, secrets?.previewSecret)
                  }
                />
              </Grid>
            </Stack>
          ) : (
            <Stack padding={4} space={2}>
              <Card padding={4} radius={2} shadow={1} tone="primary">
                <Text size={2} align="center" weight="semibold">
                  You must set a secret key to use Previews.
                </Text>
              </Card>
              <Grid columns={1}>
                <Button
                  fontSize={2}
                  padding={3}
                  text="Add Secret Key"
                  tone="positive"
                  onClick={() => {
                    setShowSettings(true)
                  }}
                />
              </Grid>
            </Stack>
          )}
        </>
      ),
    },
    onHandle: () => {
      setShowPreview(true)
    },
  }
}
