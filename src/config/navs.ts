import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
  CommandLineIcon,
  HeartIcon,
  HomeIcon,
  PresentationChartLineIcon,
  RocketLaunchIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'

export const defaultMainNav = [
  {
    name: 'navs.defaultMainNav.home',
    href: '/',
  },
  // {
  //   name: 'navs.defaultMainNav.news',
  //   href: '/news/',
  // },
  {
    name: 'navs.defaultMainNav.explore',
    href: '/explore/',
  },
  {
    name: 'navs.defaultMainNav.docs',
    href: '/docs/',
  },
]

export const commonFooterNav = [
  {
    name: 'navs.commonFooterNav.news',
    href: '/news/',
  },
  {
    name: 'navs.commonFooterNav.docs',
    href: '/docs/',
  },
  {
    name: 'navs.commonFooterNav.privacy',
    href: '/legal/privacy-policy/',
  },
]

export const docMenuNav = [
  { name: 'docs:menuNav.home', href: '/doc/', icon: HomeIcon },
  {
    name: 'docs:menuNav.general.groupTitle',
    children: [
      {
        name: 'docs:menuNav.general.motivation',
        href: '/docs/general/motivation/',
        icon: HeartIcon,
      },
      {
        name: 'docs:menuNav.general.quickstart',
        href: '/docs/general/quickstart/',
        icon: RocketLaunchIcon,
      },
      {
        name: 'docs:menuNav.general.readme',
        href: '/docs/general/readme/',
        icon: BookOpenIcon,
      },
    ],
  },
  {
    name: 'docs:menuNav.protocols.groupTitle',
    children: [
      {
        name: 'docs:menuNav.general.motivation',
        href: '/docs/general/motivation/',
        icon: HeartIcon,
      },
      {
        name: 'docs:menuNav.general.quickstart',
        href: '/docs/general/quickstart/',
        icon: RocketLaunchIcon,
      },
      {
        name: 'docs:menuNav.general.readme',
        href: '/docs/general/readme/',
        icon: BookOpenIcon,
      },
    ],
  },
  {
    name: 'docs:menuNav.hackers.groupTitle',
    children: [
      {
        name: 'docs:menuNav.general.motivation',
        href: '/docs/general/motivation/',
        icon: HeartIcon,
      },
      {
        name: 'docs:menuNav.general.quickstart',
        href: '/docs/general/quickstart/',
        icon: RocketLaunchIcon,
      },
      {
        name: 'docs:menuNav.general.readme',
        href: '/docs/general/readme/',
        icon: BookOpenIcon,
      },
    ],
  },
]

export const docHeaderNav = [
  {
    name: 'docs:headerNav.home',
    href: '/',
  },
  {
    name: 'docs:headerNav.news',
    href: '/news/',
  },
]

export const userMenuNav = [
  {
    name: 'user:menuNav.dashboard',
    href: '/user/dashboard/',
    icon: PresentationChartLineIcon,
  },
  {
    name: 'user:menuNav.vulnerabilities',
    href: '/user/vulnerabilities/',
    icon: ShieldExclamationIcon,
  },
  {
    name: 'user:menuNav.hacks',
    href: '/user/hacks/',
    icon: CommandLineIcon,
  },
  // {
  //   name: 'user:menuNav.vertexAi',
  //   href: '/user/vertex-ai/',
  //   icon: AcademicCapIcon,
  // },
  // {
  //   name: 'user:menuNav.chat',
  //   href: '/user/chat/',
  //   icon: ChatBubbleLeftRightIcon,
  // },
  {
    name: 'user:menuNav.settings',
    href: '/user/settings/',
    icon: Cog8ToothIcon,
  },
]

export const userHeaderNav = [
  {
    name: 'user:headerNav.settings',
    href: '/user/settings/',
  },
]
