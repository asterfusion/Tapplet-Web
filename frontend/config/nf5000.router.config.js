import { Children } from "react";
export default [
    {
        path: '/auth',
        component: '../layouts/nf5000_UserLayout',
        routes: [
          {
            name: 'login',
            path: '/auth/login',
            component: './nf5000_login/login',
          },
        ],
    },
    {
        path: '/',
        component: '../layouts/nf5000_SecurityLayout',
        routes: [
            {
                path: '/',
                component: '../layouts/nf5000_BasicLayout',
                Routes: ['src/pages/nf5000_Authorized'],
                routes: [
                    {path: '/', redirect: '/welcome'},
                    {
                        path: 'welcome',
                        name: 'welcome',
                        icon: 'home',
                        component: './nf5000_home/nf5000_home',
                    },
                    {
                        path: 'policy',
                        name: 'policy',
                        icon: 'control',
                        component: './nf5000_policy/nf5000_policy',
                    },
                    {
                        path: 'statistics',
                        name: 'statistics',
                        icon: 'line-chart',
                        component: './nf5000_statistics/nf5000_statistics',
                    },
                    {
                        path: 'business',
                        name: 'business',
                        icon: 'setting',
                        routes: [
                            {
                                path: '/business', redirect: '/business/setting'
                            },
                            {
                                path: 'setting',
                                name: 'setting',
                                component: './nf5000_business/nf5000_setting',
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
                                component: './nf5000_sysinfo/nf5000_time',
                            },{
                                path: 'configwrite',
                                name: 'configwrite',
                                component: './nf5000_sysinfo/nf5000_write',
                            },{
                                path: 'configreset',
                                name: 'configreset',
                                component: './nf5000_sysinfo/nf5000_reset',
                            },{
                                path: 'hostname',
                                name: 'hostname',
                                component: './nf5000_sysinfo/nf5000_hostname',
                            },{
                                path: 'version',
                                name: 'version',
                                component: './nf5000_sysinfo/nf5000_version',

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
                                component: './nf5000_users/user',
                            }, {
                                path: 'role',
                                name: 'role',
                                component: './nf5000_users/role',
                        }]
                    },
                    {
                        path: 'log',
                        name: 'log',
                        icon: 'history',
                        routes: [
                            {
                                path: 'log',
                                name: 'log',
                                component: './nf5000_log/nf5000_log',
                            },
                            {
                                path: 'waringlog',
                                name: 'waringlog',
                                component: './nf5000_log/nf5000_waringlog',
                            },]
                    },
                    {
                        component: './nf5000_404',
                    },
                ],
            },
            {
                component: './nf5000_404',
            },
        ],
    },
    {
        component: './nf5000_404',
    },
]