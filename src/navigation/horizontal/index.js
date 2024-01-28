const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },

  {
    title: 'User',
    icon: 'tabler:user',
    children: [
      {
        title: 'List',
        path: '/apps/user/list'
      },
      {
        title: 'View',
        children: [
          {
            title: 'Account',
            path: '/apps/user/view/account'
          },
          {
            title: 'Security',
            path: '/apps/user/view/security'
          },
          {
            title: 'Billing & Plans',
            path: '/apps/user/view/billing-plan'
          },
          {
            title: 'Notifications',
            path: '/apps/user/view/notification'
          },
          {
            title: 'Connection',
            path: '/apps/user/view/connection'
          }
        ]
      }
    ]
  },

  {
    title: 'Second Page',
    path: '/second-page',
    icon: 'tabler:mail'
  },

  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'tabler:shield'
  }
]

export default navigation
