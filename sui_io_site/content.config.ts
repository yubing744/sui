// TODO change to docs.sui.io
//'https://docs.sui.io/';
const baseUrl = 'https://devportal-30dd0.web.app'

export const siteContent = {
    HeadersData: {
        links: [
            {
                label: 'Developers',
                link: '#',
                iconName: 'sui-dev-icon',
                subMenu: [
                    {
                        label: 'Getting Started',
                        link: `${baseUrl}/build`,
                        external: true,
                    },
                    {
                        label: 'Documentation',
                        link: baseUrl,
                        external: true,
                    },
                ],
            },
            {
                label: 'Ecosystem',
                link: '#',
                iconName: 'sui-eco-icon',
                subMenu: [
                    {
                        label: 'Gaming',
                        link: '/ecosystem/gaming',
                    },
                    {
                        label: 'Finance',
                        link: '/ecosystem/finance',
                    },
                ],
            },
            {
                label: 'Community',
                link: '#',
                iconName: 'sui-community-icon',
                subMenu: [
                    {
                        label: 'Twitter',
                        link: 'https://twitter.com/mysten_labs',
                        external: true,
                    },
                    {
                        label: 'Medium',
                        link: 'https://medium.com/mysten-labs',
                        external: true,
                    },
                    {
                        label: 'Discord',
                        link: 'http://discord.gg/mysten',
                        external: true,
                    },
                    /*{
                        label: 'LinkedIn',
                        link: '#',
                    },
                    {
                        label: 'News',
                        link: '#',
                    },*/
                ],
            },
            {
                label: 'Whitepaper',
                link: 'https://github.com/MystenLabs/sui/blob/main/doc/paper/sui.pdf',
                external: true,
            },
            {
                label: 'About Us',
                link: 'https://mystenlabs.com',
                external: true,
            },
        ],
    },
    footerData: {
        menu: [
            {
                label: 'Build',
                subMenu: [
                    {
                        title: 'Docs',
                        link: `${baseUrl}/build`,
                        external: true,
                    },
                    {
                        title: 'Github',
                        link: 'https://github.com/MystenLabs',
                    },
                    {
                        title: 'Chat on Discord',
                        link: 'https://discord.gg/Tcfn7UdmAc',
                    },
                    {
                        title: 'Status',
                        link: '#',
                    },
                ],
            },
            {
                label: 'Join',
                subMenu: [
                    {
                        title: 'Mysten Labs',
                        link: 'https://mystenlabs.com',
                        external: true,
                    },
                    {
                        title: 'Careers',
                        link: 'https://jobs.lever.co/mystenlabs',
                        external: true,
                    },
                ],
            },
            {
                label: 'Learn',
                subMenu: [
                    {
                        title: 'Blog',
                        link: '#',
                        external: true,
                    },
                    {
                        title: 'Community',
                        link: '#',
                        external: true,
                    },
                ],
            },
            {
                label: 'Sui',
                subMenu: [
                    {
                        title: 'Break Sui',
                        link: `${baseUrl}/contribute`,
                        external: true,
                    },
                    {
                        title: 'Disclaimer',
                        link: '#',
                        external: true,
                    },
                    {
                        title: 'Press & Brand',
                        link: '#',
                        external: true,
                    },
                ],
            },
        ],
    },
    siteinfo: {
        copyright: '©2022 Copyright Sui. All rights reserved.',
        privacy: {
            title: 'Privacy Policy',
            link: '/policy',
        },
        terms: {
            title: 'Terms of Service',
            link: '/terms',
        },
    },
}
