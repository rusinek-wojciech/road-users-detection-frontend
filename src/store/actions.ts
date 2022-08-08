export enum ActionType {
  TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR = 'CLOSE_SIDEBAR',
  TOGGLE_PALETTE_MODE = 'TOGGLE_PALETTE_MODE',
}

export const toggleSidebar = () => ({
  type: ActionType.TOGGLE_SIDEBAR,
  payload: null,
})

export const closeSidebar = () => ({
  type: ActionType.CLOSE_SIDEBAR,
  payload: null,
})

export const togglePaletteMode = () => ({
  type: ActionType.TOGGLE_PALETTE_MODE,
  payload: null,
})

export type Actions =
  | ReturnType<typeof toggleSidebar>
  | ReturnType<typeof closeSidebar>
  | ReturnType<typeof togglePaletteMode>
