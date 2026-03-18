import { apiUrl } from "../lib/api";

export type TrademarkedMove = {
  id: string;
  wrestlerId: string;
  trademarkNumber: string;
  lastUpdated: string;
  status: string;
  champion: string;
  moveName: string;
  actualMoveName: string;
  category: "Signature" | "Finisher" | "Variant" | "Super Finisher";
  variantType?: string;
};

type TrademarkedMovesResponse = {
  ok: boolean;
  count: number;
  results: TrademarkedMove[];
};

export async function fetchTrademarkedMoves(): Promise<TrademarkedMove[]> {
  try {
    const res = await fetch(apiUrl("/data/trademarked-moves.json"), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to load trademarked moves (${res.status})`);
    }

    const json = (await res.json()) as TrademarkedMovesResponse;

    if (!json?.ok || !Array.isArray(json.results)) {
      return [];
    }

    return json.results;
  } catch (error) {
    console.error("Failed to load trademarked moves:", error);
    return [];
  }
}