import { Children } from "react";
export default [
    {
        path: '/auth',
        component: '../layouts/sf3000_UserLayout',
        routes: [
          {
            name: 'login',
            path: '/auth/login',
            component: './sf3000_login/login',
          },
        ],
    },
    {
        path: '/',
        component: '../layouts/sf3000_SecurityLayout',
        routes: [
            {
                path: '/',
                component: '../layouts/sf3000_BasicLayout',
                Routes: ['src/pages/sf3000_Authorized'],
                routes: [
                    {path: '/', redirect: '/welcome'},
                    {
                        path: 'welcome',
                        name: 'welcome',
                        icon: 'home',
                        component: './sf3000_home/sf3000_home',
                    },
                    {
                        path: 'policy',
                        name: 'policy',
                        icon: 'control',
                        component: './sf3000_policy/sf3000_policy',
                    },
                    {
                        path: 'statistics',
                        name: 'statistics',
                        icon: 'line-chart',
                        component: './sf3000_statistics/sf3000_statistics',
                    },
                    {
                        path: 'business',
                        name: 'business',
                        icon: 'bars',
                        routes: [
                            {
                                path: '/business', redirect: '/business/setting'
                            },
                            {
                                path: 'setting',
                                name: 'setting',
                                component: './sf3000_business/sf3000_setting',
                        }]
                    },
                    {
                        path: 'system',
                        name: 'system',
                        icon: 'bars',
                        routes: [
                            {
                                path: '/system', redirect: '/system/time'
                            },
                            {
                                path: 'time',
                                name: 'time',
                                component: './sf3000_sysinfo/sf3000_time',
                            },{
                                path: 'configwrite',
                                name: 'configwrite',
                                component: './sf3000_sysinfo/sf3000_write',
                            },{
                                path: 'configreset',
                                name: 'configreset',
                                component: './sf3000_sysinfo/sf3000_reset',
                            },{
                                path: 'hostname',
                                name: 'hostname',
                                component: './sf3000_sysinfo/sf3000_hostname',
                            },{
                                path: 'version',
                                name: 'version',
                                component: './sf3000_sysinfo/sf3000_version',

                        }]
                    },
                    {
                        path: 'usermanage',
                        name: 'usermanage',
                        icon: 'user',
                        routes: [
                            {
                                path: '/usermanage', redirect: '/usermanage/user'
                            },
                            {
                                path: 'user',
                                name: 'user',
                                component: './sf3000_users/user',
                            }, {
                                path: 'role',
                                name: 'role',
                                component: './sf3000_users/role',
                        }]
                    },
                    {
                        path: 'log',
                        name: 'log',
                        icon: 'history',
                        routes: [
                            {
                                path: '/log', redirect: '/log/log'
                            },
                            {
                                path: 'log',
                                name: 'log',
                                component: './sf3000_log/sf3000_log',
                            },
                            {
                                path: 'waringlog',
                                name: 'waringlog',
                                component: './sf3000_log/sf3000_waringlog',
                            },]
                    },
                    {
                        component: './sf3000_404',
                    },
                ],
            },
            {
                component: './sf3000_404',
            },
        ],
    },
    {
        component: './sf3000_404',
    },
]