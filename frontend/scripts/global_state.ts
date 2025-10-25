// global-state.ts

// ΥΠΟΘΕΣΗ: Πρέπει να εισάγετε τον τύπο GlobalStats αν δεν είναι ήδη ορισμένος εδώ.
// import { GlobalStats } from "./types.js"; 

export interface GlobalStats { // Αν ορίσετε τον τύπο εδώ
    globalWinnerAliases: string[];
}

export const globalState: GlobalStats = {
    globalWinnerAliases: [],
};

// Βοηθητική συνάρτηση για την τροποποίηση της κατάστασης
export function addGlobalWinner(name: string) {
    globalState.globalWinnerAliases.push(name);
}