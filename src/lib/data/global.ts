export interface FooterData {
  brandName: string
  credits: {
    author: string
    href: string
    label: string
  }
  links: NavLink[]
  tagline: string
}

export interface GlobalData {
  archives_meta: Meta
  detail_meta: (_name: string) => Meta
  footer: FooterData
  header: HeaderData
  home_meta: Meta
  site_meta: Meta
}

export interface HeaderData {
  nav: NavLink[]
  subtitle: string
  title: string
}

export interface Meta {
  description: string
  ogImage?: string
  ogUrl?: string
  title: string
}

export interface NavLink {
  href: string
  label: string
}

export const global: GlobalData = {
  archives_meta: {
    description: 'A complete list of legendary creatures documented across North America.',
    title: 'Cryptid Archives | American Bestiary',
  },
  detail_meta: (name: string) => ({
    description: `Biological anatomy, ecological niches, and behavioral profiles for the ${name}.`,
    title: `${name} | American Bestiary Specimen`,
  }),
  footer: {
    brandName: 'American Bestiary',
    credits: {
      author: 'Tavo Montañez',
      href: 'https://tavomontanez.art/the-american-bestiary',
      label: 'Illustrations by',
    },
    links: [
      { href: '/api/docs', label: 'API Docs' },
      { href: '/api/graphql', label: 'GraphQL' },
    ],
    tagline: '50 cryptids. One per state.',
  },
  header: {
    nav: [
      { href: '/', label: 'Map' },
      { href: '/archives', label: 'Archives' },
    ],
    subtitle: 'Legendary creatures of North America',
    title: 'American Bestiary',
  },
  home_meta: {
    description: 'Explore the interactive map of North American cryptids and legends.',
    title: 'American Bestiary: 50 Cryptids. One State.',
  },
  site_meta: {
    description: 'Legendary creatures of North America - 50 cryptids, one per state.',
    title: 'American Bestiary',
  },
}
