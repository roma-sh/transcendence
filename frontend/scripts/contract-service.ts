// Lightweight blockchain integration for storing and reading tournament winners
// Uses ethers.js exposed globally via a script tag in pong.html

import { wallet } from "./wallet-connect.js";

declare const ethers: any;

interface ContractMeta {
  address: string;
  abi: any[];
}

interface OnChainTournament {
  id: number;
  name: string;
  winner: string;
  finalized: boolean;
}

class ContractService {
  private meta: ContractMeta | null = null;
  private contract: any | null = null;

  private async loadMeta(): Promise<ContractMeta> {
    if (this.meta) return this.meta;

    const response = await fetch("/scripts/js/contract/pong.json", {
      method: "GET",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error("Contract metadata (pong.json) not found or unreachable.");
    }

    const json = await response.json();
    if (!json.address || !json.abi) {
      throw new Error("Invalid pong.json: missing address or abi.");
    }

    this.meta = {
      address: json.address,
      abi: json.abi,
    };
    return this.meta;
  }

  private async getContract(): Promise<any> {
    if (this.contract) return this.contract;

    const meta = await this.loadMeta();
    const win: any = window;

    if (!win.ethereum) {
      throw new Error("No Ethereum provider found. Please connect a wallet first.");
    }
    if (typeof ethers === "undefined") {
      throw new Error("ethers.js is not loaded. Check script tag in pong.html.");
    }

    const provider = new ethers.BrowserProvider(win.ethereum);
    const signer = await provider.getSigner();
    this.contract = new ethers.Contract(meta.address, meta.abi, signer);
    return this.contract;
  }

  /**
   * Store the winner of a finished tournament on chain.
   * - Does nothing if wallet is not connected.
   * - Never throws to the caller: logs errors to console instead.
   */
  public async recordTournamentWinner(
    tournamentName: string,
    winnerAlias: string
  ): Promise<void> {
    try {
      const info = wallet.getWalletInfo();

      if (!info.isConnected || !info.address) {
        console.log(
          "[Blockchain] Wallet not connected, skipping on-chain tournament record."
        );
        return;
      }

      const contract = await this.getContract();
      const label =
        tournamentName && winnerAlias
          ? `${tournamentName} - Winner: ${winnerAlias}`
          : tournamentName || "Pong Tournament";

      // 1) Create a tournament on-chain
      const txCreate = await contract.createTournament(label);
      await txCreate.wait();

      // 2) Resolve new tournament id (last index = tournamentCount - 1)
      const countRaw = await contract.tournamentCount();
      const countNum = Number(countRaw);
      const newId = countNum - 1;

      if (newId < 0) {
        console.warn(
          "[Blockchain] Unexpected tournamentCount value, skipping participant/winner record."
        );
        return;
      }

      // 3) Add the connected wallet as participant
      const txAdd = await contract.addParticipants(newId, info.address);
      await txAdd.wait();

      // 4) Declare the connected wallet as winner
      const txWin = await contract.declareWinner(newId, info.address);
      await txWin.wait();

      console.log(
        `[Blockchain] Tournament stored on-chain. ID=${newId}, winner=${info.address}`
      );
    } catch (err) {
      console.error("[Blockchain] Failed to store tournament winner on chain:", err);
    }
  }

  /**
   * Fetch recent tournaments from the blockchain for verification.
   * Returns most recent first, up to the given limit.
   */
  public async getRecentWinners(
    limit: number = 5
  ): Promise<OnChainTournament[]> {
    const result: OnChainTournament[] = [];

    try {
      const contract = await this.getContract();
      const countRaw = await contract.tournamentCount();
      const total = Number(countRaw);

      if (!Number.isFinite(total) || total <= 0) {
        return [];
      }

      for (let id = total - 1; id >= 0 && result.length < limit; id--) {
        const t = await contract.getTournament(id);

        // getTournament returns:
        // (name, timestamp, creator, winner, finalized, participantsCount)
        const name: string = t.name;
        const winner: string = t.winner;
        const finalized: boolean = t.finalized;

        result.push({ id, name, winner, finalized });
      }

      return result;
    } catch (err) {
      console.error("[Blockchain] Failed to read tournaments from chain:", err);
      return [];
    }
  }
}

export const contractService = new ContractService();

