<template>
    <ul class="_sui-community">
        <li v-for="(social, i) in joinCommunity" :key="i">
            <a :href="social.link" target="_blank"
                ><img :src="social.icon" :alt="social.name"
            /></a>
        </li>
    </ul>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { RootState } from '~/store'

interface SocialCTA {
    name: string
    icon: string
    link: string
}

@Component
export default class Social extends Vue {
    joinCommunity: SocialCTA[] = [
        {
            name: 'twitter',
            link: 'https://twitter.com/mysten_labs',
            icon: '/assets/img/icons/twitter-icon.svg',
        },
        {
            name: 'medium',
            link: 'https://medium.com/mysten-labs',
            icon: '/assets/img/icons/medium-icon.svg',
        },
        {
            name: 'discord',
            link: 'https://discord.gg/Tcfn7UdmAc',
            icon: '/assets/img/icons/discord-icon.svg',
        },
        /*{
            name: 'instagram',
            link: '#',
            icon: '/assets/img/icons/instagram-icon.svg',
        },

        {
            name: 'youtube',
            link: '#',
            icon: '/assets/img/icons/youtube-icon.svg',
        },*/

    ]
}
</script>
