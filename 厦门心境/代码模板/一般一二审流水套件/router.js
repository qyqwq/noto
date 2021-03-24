{
      path: '/marketingBudget',
      component: () => import('@/views/emptyPage'),
      alwaysShow: true,
      name: '入库审核',
      redirect: 'noredirect',
      meta: {
        title: '入库审核',
        icon: 'el-icon-s-unfold',
        resources: 'marketingBudget'
      },
      children: [
        {
          path: 'auditOne',
          component: () => import('@/views/marketing/marketingBudget/auditOne'),
          name: 'auditOne',
          meta: { title: '一级审核', icon: 'my-user', noCache: true, resources: 'marketingBudgetOne' }
        },

        {
          path: 'auditTwo',
          component: () => import('@/views/marketing/marketingBudget/auditTwo'),
          name: 'auditTwo',
          meta: { title: '二级审核', icon: 'my-user', noCache: true, resources: 'marketingBudgetTwo' }
        },
        {
          path: 'list',
          component: () => import('@/views/marketing/marketingBudget/list'),
          name: 'list',
          meta: { title: '预算申请流水', icon: 'my-user', noCache: true, resources: 'marketingBudgetList' }
        }
      ]
    }