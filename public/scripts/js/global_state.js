// global-state.ts
export const globalState = {
    globalWinnerAliases: [],
};
// Βοηθητική συνάρτηση για την τροποποίηση της κατάστασης
export function addGlobalWinner(name) {
    globalState.globalWinnerAliases.push(name);
}
