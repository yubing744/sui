import { GetterTree } from 'vuex'
import { RootState } from '.'

const getters: GetterTree<RootState, RootState> = {
  getCore: (state: RootState) => state.core,
  getFooter: (state: RootState) => state.footer,
  navMenu: (state: RootState) => state.menu,
  devDocMenu: (state: RootState) => state.docMenu
}

export default getters
