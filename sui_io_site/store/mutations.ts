import { MutationTree } from 'vuex'
import { RootState } from './index'

// This is the mutation that will be called by the action
const mutations: MutationTree<RootState> = {
    setCore: (state: RootState, post: any) => (state.core = post),
    setFooter: (state: RootState, post: any) => (state.footer = post),
    setMenuState: (state: RootState, post: any) => (state.menu = post),
    setDevDocMenuState: (state: RootState, post: any) => (state.docMenu = post),
    setCopyRight: (state: RootState, post: any) => (state.copyRight = post),
    setactiveMenu: (state: RootState, post: any) => (state.activeMenu = post),
}
export default mutations
