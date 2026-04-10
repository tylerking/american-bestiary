import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '../../../styles/theme.css'

export const root = style({
  display: 'flex',
  flexDirection: 'column',
})

export const mapSection = style({
  padding: `${theme.spacing[8]} 0`,
  width: '100%',
})

export const bestiary = style({
  background: theme.colors.background.subtle,
  borderBottom: `1px solid ${theme.colors.border.base}`,
  borderTop: `1px solid ${theme.colors.border.base}`,
  padding: `${theme.spacing[16]} 0`,
})

export const bestiaryInner = style({
  '@media': {
    '(max-width: 900px)': {
      gap: theme.spacing[10],
      gridTemplateColumns: '1fr',
    },
  },
  display: 'grid',
  gap: theme.spacing[12],
  gridTemplateColumns: '1fr 1fr',
})

export const bestiaryContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[5],
})

export const bestiaryHeading = style({
  marginBottom: theme.spacing[2],
})

export const specimenCard = style({
  '@media': {
    '(max-width: 900px)': {
      maxWidth: '500px',
    },
  },
  backgroundColor: theme.colors.background.card,
  border: `1px solid ${theme.colors.border.base}`,
  boxShadow: theme.shadow.base,
  display: 'flex',
  flexDirection: 'column',
})

export const specimenCardHeader = style({
  alignItems: 'baseline',
  borderBottom: `1.5px solid ${theme.colors.brand.accent}`,
  display: 'flex',
  gap: theme.spacing[3],
  justifyContent: 'space-between',
  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
})

export const specimenCardLabel = style({
  color: theme.colors.foreground.muted,
  flexShrink: 0,
  fontSize: '0.75rem',
  fontStyle: 'italic',
})

export const specimenCardBody = style({
  padding: theme.spacing[4],
  selectors: {
    '&::after': {
      clear: 'both',
      content: '\'\'',
      display: 'table',
    },
  },
})

export const specimenCardPlate = style({
  float: 'right',
  margin: `0 0 ${theme.spacing[3]} ${theme.spacing[4]}`,
  width: '45%',
})

export const specimenCardImage = style({
  border: `1px solid ${theme.colors.border.base}`,
  display: 'block',
  height: 'auto',
  width: '100%',
})

export const specimenCardCaption = style({
  color: theme.colors.foreground.muted,
  fontSize: '0.7rem',
  fontStyle: 'italic',
  marginTop: theme.spacing[1],
  textAlign: 'center',
})

export const diagramField = style({
  borderLeft: `2px solid ${theme.colors.brand.accent}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[1],
  marginBottom: theme.spacing[3],
  paddingLeft: theme.spacing[3],
})

export const diagramFieldLabel = style({
  color: theme.colors.brand.primary,
  fontSize: '0.72rem',
  fontWeight: theme.typography.fontWeight.bold,
  letterSpacing: theme.typography.letterSpacing.wider,
  textTransform: 'uppercase',
})

export const diagramFieldValue = style({
  color: theme.colors.foreground.mid,
  fontSize: theme.typography.fontSize.body,
  lineHeight: theme.typography.lineHeight.normal,
})

export const specimensSection = style({
  padding: `${theme.spacing[16]} 0 ${theme.spacing[20]}`,
})

export const specimensHeading = style({
  marginBottom: theme.spacing[3],
  textAlign: 'center',
})

export const specimensSubheading = style({
  color: theme.colors.foreground.muted,
  fontStyle: 'italic',
  marginBottom: theme.spacing[10],
  textAlign: 'center',
})

export const specimenGrid = style({
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  display: 'grid',
  gap: '28px',
  gridTemplateColumns: 'repeat(3, 1fr)',
})

export const notableCard = style({
  backgroundColor: theme.colors.background.card,
  border: `1px solid ${theme.colors.border.base}`,
  borderRadius: theme.radius.sm,
  boxShadow: theme.shadow.base,
  color: theme.colors.foreground.root,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  selectors: {
    '&:hover': {
      boxShadow: theme.shadow.lg,
      textDecoration: 'none',
      transform: 'translateY(-2px)',
    },
  },
  textDecoration: 'none',
  transition: `box-shadow ${theme.transition.slow}, transform ${theme.transition.slow}`,
})

const specimenAwardBase = style({
  alignItems: 'center',
  borderBottom: `1px solid ${theme.colors.border.base}`,
  display: 'flex',
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '0.82rem',
  fontVariationSettings: '\'SOFT\' 100, \'WONK\' 1',
  fontWeight: 700,
  gap: theme.spacing[2],
  letterSpacing: theme.typography.letterSpacing.wide,
  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
  selectors: {
    '&::before': {
      content: '"\\2605"',
      fontSize: '0.7rem',
    },
  },
  textTransform: 'uppercase',
})

export const awardColor = styleVariants({
  blue: [
    specimenAwardBase,
    {
      background: theme.colors.map.blue,
      borderBottomColor: theme.colors.map.blue,
      color: theme.colors.background.root,
    },
  ],
  brown: [
    specimenAwardBase,
    {
      background: theme.colors.map.brown,
      borderBottomColor: theme.colors.map.brown,
      color: theme.colors.background.root,
    },
  ],
  green: [
    specimenAwardBase,
    {
      background: theme.colors.map.green,
      borderBottomColor: theme.colors.map.green,
      color: theme.colors.background.root,
    },
  ],
  orange: [
    specimenAwardBase,
    {
      background: theme.colors.map.orange,
      borderBottomColor: theme.colors.map.orange,
      color: theme.colors.background.root,
    },
  ],
  purple: [
    specimenAwardBase,
    {
      background: theme.colors.map.purple,
      borderBottomColor: theme.colors.map.purple,
      color: theme.colors.background.root,
    },
  ],
  red: [
    specimenAwardBase,
    {
      background: theme.colors.map.red,
      borderBottomColor: theme.colors.map.red,
      color: theme.colors.background.root,
    },
  ],
  teal: [
    specimenAwardBase,
    {
      background: theme.colors.map.teal,
      borderBottomColor: theme.colors.map.teal,
      color: theme.colors.background.root,
    },
  ],
})

export const specimenImage = style({
  aspectRatio: '4 / 3',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
})

export const specimenImg = style({
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  selectors: {
    [`${notableCard}:hover &`]: {
      transform: 'scale(1.05)',
    },
  },
  transition: `transform ${theme.transition.slow}`,
  width: '100%',
})

export const specimenContent = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: theme.spacing[2],
  padding: theme.spacing[5],
})

export const specimenTitleRow = style({
  alignItems: 'baseline',
  display: 'flex',
  gap: theme.spacing[3],
  justifyContent: 'space-between',
})

export const specimenName = style({
  color: theme.colors.brand.primary,
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '1.25rem',
  fontVariationSettings: '\'SOFT\' 100, \'WONK\' 1',
  fontWeight: 800,
})

export const specimenRegion = style({
  color: theme.colors.status.success,
  flexShrink: 0,
})
