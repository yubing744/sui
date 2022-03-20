// eslint-disable-next-line import/named
import { ActionTree } from 'vuex'
import { siteContent } from '../content.config'
import { RootState } from '.'


const actions: ActionTree<RootState, RootState> = {
  /// Get site wide settings and store them in the state
  nuxtServerInit({ commit }: any) {
    commit('setCore', siteContent.siteinfo)
    commit('setFooter', siteContent.footerData)
    commit('setMenuState', siteContent.HeadersData)
  }
}

export default actions
