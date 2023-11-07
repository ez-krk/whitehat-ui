import {
  AcademicCapIcon,
  BookOpenIcon,
  BugAntIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  Cog8ToothIcon,
  CommandLineIcon,
  CurrencyDollarIcon,
  EyeSlashIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  PresentationChartLineIcon,
  ReceiptPercentIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserPlusIcon,
  WrenchScrewdriverIcon,
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
    name: 'navs.defaultMainNav.home',
    href: '/',
  },
  // {
  //   name: 'navs.commonFooterNav.news',
  //   href: '/news/',
  // },
  {
    name: 'navs.defaultMainNav.explore',
    href: '/explore/',
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
  { name: 'docs:menuNav.home', href: '/docs/', icon: HomeIcon },
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
      // {
      //   name: 'docs:menuNav.general.protocols',
      //   href: '/docs/general/protocols/',
      //   icon: ShieldCheckIcon,
      // },
      // {
      //   name: 'docs:menuNav.general.hackers',
      //   href: '/docs/general/hackers/',
      //   icon: CommandLineIcon,
      // },
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
        name: 'docs:menuNav.protocols.register',
        href: '/docs/protocols/register/',
        icon: UserPlusIcon,
      },
      {
        name: 'docs:menuNav.protocols.fees',
        href: '/docs/protocols/fees/',
        icon: ReceiptPercentIcon,
      },
      {
        name: 'docs:menuNav.protocols.payout',
        href: '/docs/protocols/payout/',
        icon: CurrencyDollarIcon,
      },
    ],
  },
  {
    name: 'docs:menuNav.hackers.groupTitle',
    children: [
      {
        name: 'docs:menuNav.hackers.explore',
        href: '/docs/hackers/explore/',
        icon: MagnifyingGlassIcon,
      },
      {
        name: 'docs:menuNav.hackers.vulnerability',
        href: '/docs/hackers/vulnerability/',
        icon: BugAntIcon,
      },
      {
        name: 'docs:menuNav.hackers.exploit',
        href: '/docs/hackers/exploit/',
        icon: CommandLineIcon,
      },
      {
        name: 'docs:menuNav.hackers.tooling',
        href: '/docs/hackers/tooling/',
        icon: WrenchScrewdriverIcon,
      },
      {
        name: 'docs:menuNav.hackers.legalDischarge',
        href: '/docs/genera/legal-discharge/',
        icon: CheckBadgeIcon,
      },
      {
        name: 'docs:menuNav.hackers.anonymity',
        href: '/docs/hackers/anonymity/',
        icon: EyeSlashIcon,
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
    href: '/dashboard/',
    icon: PresentationChartLineIcon,
  },
  {
    name: 'user:menuNav.vulnerabilities',
    href: '/vulnerabilities/',
    icon: ShieldExclamationIcon,
  },
  {
    name: 'user:menuNav.hacks',
    href: '/hacks/',
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
  // {
  //   name: 'user:menuNav.settings',
  //   href: '/settings/',
  //   icon: Cog8ToothIcon,
  // },
]

export const userHeaderNav = [
  {
    name: 'user:headerNav.settings',
    href: '/settings/',
  },
]
