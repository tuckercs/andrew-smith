import React from 'react';
import { IntentLink, Link } from 'sanity/router';
import { Card, Stack, Text } from '@sanity/ui';

export const documentReference = (
  S,
  context,
  { title, icon, link, type, query, views }
) => {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(async () => {
      const sanityClient = context.getClient({ apiVersion: '2023-01-01' });
      const data = await sanityClient.fetch(query);

      if (!data?._id)
        return S.component(() => (
          <Card padding={4}>
            <Card padding={[5]} radius={3} shadow={0} tone="primary">
              <Stack space={[3]}>
                <Text align="center" size={[2]} weight="semibold">
                  The {title} has not been set.
                </Text>
                {link && (
                  <Text align="center" size={[2]}>
                    Set your {title} from the{' '}
                    <Link href={link.url}>{link.title}</Link>
                  </Text>
                )}
              </Stack>
            </Card>

            {type && (
              <Stack padding={3} space={[3]}>
                <Text align="center" muted size={[1]}>
                  Don't have a {type} yet?{' '}
                  <IntentLink intent="create" params={{ type }}>
                    Create one now
                  </IntentLink>
                </Text>
              </Stack>
            )}
          </Card>
        )).title(title);

      return S.document().id(data._id).schemaType('page').views(views);
    });
};
