// custom-portable-text.jsx
import React from 'react'
import {
  defineType,
  defineField,
  defineArrayMember,
  defineFieldset,
} from 'sanity'
import {
  HighlighterCircleIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from '@phosphor-icons/react'

import { customLink } from '@s/lib/custom-link'
import { customImage } from '@s/lib/custom-image'

const BodyLargeStyle = (props) => (
  <span className="font-sans" style={{ fontSize: '1.5em' }}>
    {props.children}
  </span>
)

const HighlightDecorator = (props) => (
  <span className="is-highlighted">{props.children}</span>
)

export const customPortableText = ({
  type,
  add = {},
  remove = {},
  ...props
} = {}) => {
  const typeSettings = {
    simple: {
      remove: {
        styles: ['bodyLarge', 'h1', 'h2', 'h3', 'h4'],
        lists: ['bullet', 'number'],
        marks: {
          decorators: ['strong', 'em'],
        },
        blocks: ['photo'],
      },
    },
  }[type]

  const styles = [
    { title: 'Body (regular)', value: 'normal' },
    { title: 'Body (large)', value: 'bodyLarge', component: BodyLargeStyle },
    { title: 'Header 1', value: 'h1' },
    { title: 'Header 2', value: 'h2' },
    { title: 'Header 3', value: 'h3' },
    { title: 'Header 4', value: 'h4' },
    ...(typeSettings?.add?.styles || []),
    ...(add?.styles || []),
  ].filter(
    (item) =>
      !(remove?.styles || []).includes(item.value) &&
      !(typeSettings?.remove?.styles || []).includes(item.value),
  )

  const lists = [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Number', value: 'number' },
    ...(typeSettings?.add?.lists || []),
    ...(add?.lists || []),
  ].filter(
    (item) =>
      !(remove?.lists || []).includes(item.value) &&
      !(typeSettings?.remove?.lists || []).includes(item.value),
  )

  const marks = {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
      {
        title: 'Align Left',
        value: 'alignLeft',
        icon: TextAlignLeftIcon,
        component: (props) => (
          <span className="block text-left">{props.children}</span>
        ),
      },
      {
        title: 'Align Center',
        value: 'alignCenter',
        icon: TextAlignCenterIcon,
        component: (props) => (
          <span className="block text-center">{props.children}</span>
        ),
      },
      {
        title: 'Align Right',
        value: 'alignRight',
        icon: TextAlignRightIcon,
        component: (props) => (
          <span className="block text-right">{props.children}</span>
        ),
      },
      ...(typeSettings?.add?.marks?.decorators || []),
      ...(add?.marks?.decorators || []),
    ].filter(
      (item) =>
        !(remove?.marks?.decorators || []).includes(item.value) &&
        !(typeSettings?.remove?.marks?.decorators || []).includes(item.value),
    ),
    annotations: [
      defineType({
        title: 'Link',
        name: 'link',
        type: 'object',
        options: { modal: { type: 'dialog', width: 'medium' } },
        fields: [
          defineField({
            title: 'Link',
            name: 'link',
            type: 'array',
            of: [
              defineField({
                ...customLink({ hasDisplayTitle: false, internal: true }),
              }),
              defineField({ ...customLink({ hasDisplayTitle: false }) }),
              defineField({
                ...customLink({ hasFile: true, hasDisplayTitle: false }),
              }),
            ],
            validation: (Rule) =>
              Rule.length(1).error('You can only have one link'),
          }),
        ],
      }),
      ...(typeSettings?.add?.marks?.annotations || []),
      ...(add?.marks?.annotations || []),
    ].filter(
      (item) =>
        !(remove?.marks?.annotations || []).includes(item.name) &&
        !(typeSettings?.remove?.marks?.annotations || []).includes(item.name),
    ),
  }

  const blocks = [
    defineArrayMember({ ...customImage({ hasCaption: true, hasBleed: true }) }),
    ...(typeSettings?.add?.blocks || []),
    ...(add?.blocks || []),
  ].filter(
    (item) =>
      !(remove?.blocks || []).includes(item.name) &&
      !(typeSettings?.remove?.blocks || []).includes(item.name),
  )

  return defineType({
    title: 'Portable Text',
    name: 'portableText',
    type: 'array',
    of: [
      defineArrayMember({
        title: 'Block',
        type: 'block',
        styles,
        lists,
        marks,
      }),
      ...blocks,
    ],
    ...props,
  })
}
