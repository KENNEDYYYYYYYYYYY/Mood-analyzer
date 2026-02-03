import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const CONTRACT_ADDRESS = "0x8C1308405Cec94423E91d115584e7267dcB75a47";

let client: any = null;

export const initializeGenLayer = async () => {
  if (client) {
    console.log("initializeGenLayer: reusing existing client");
    return client;
  }

  const privateKey = import.meta.env.VITE_GENLAYER_KEY || "";
  if (!privateKey) {
    console.error("initializeGenLayer: Missing VITE_GENLAYER_KEY in environment");
    return null;
  }

  // Create account (do not log the private key)
  const account = createAccount(privateKey);
  console.log("initializeGenLayer: created account");

  client = createClient({ chain: studionet, account });
  console.log("initializeGenLayer: client created");

  try {
    console.log("initializeGenLayer: initializing consensus smart contract...");
    await client.initializeConsensusSmartContract();
    console.log("initializeGenLayer: GenLayer consensus initialized");
  } catch (initErr) {
    console.error("initializeGenLayer: failed to initialize consensus smart contract:", initErr);
    throw initErr;
  }

  return client;
};

export interface MoodData {
  joyful: number;
  melancholy: number;
  energy: number;
  bravery: number;
  focus: number;
  irritation: number;
  social: number;
  anxiety: number;
  anger: number;
  excitement: number;
  confidence: number;
  burnout: number;
  loneliness: number;
  peace: number;
  boredom: number;
  productivity: number;
  confusion: number;
  gratitude: number;
  insecurity: number;
}

export interface AdviceResponse {
  advice: string;
  suggested_action: string;
}

export const analyzeMood = async (moodData: MoodData): Promise<AdviceResponse | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      console.error("Failed to initialize GenLayer client");
      return null;
    }
    const moodString = JSON.stringify(moodData);

    console.log("analyzeMood: sending analyze_mood writeContract", { address: CONTRACT_ADDRESS, functionName: "analyze_mood" });

    const hash = await activeClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "analyze_mood",
      args: [moodString],
    });

    console.log("analyzeMood: Transaction sent", { hash });

    try {
      console.log("analyzeMood: waiting for transaction receipt (status ACCEPTED)...");
      const start = Date.now();
      await activeClient.waitForTransactionReceipt({
        hash,
        status: "ACCEPTED",
        retries: 150,
        interval: 5000,
      });
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`analyzeMood: Transaction accepted after ${elapsed}s, fetching advice...`);
    } catch (waitErr) {
      console.error("analyzeMood: error while waiting for transaction receipt:", waitErr);
      throw waitErr;
    }

    // Immediately fetch the latest advice after acceptance
    return await getLatestAdvice();
  } catch (e) {
    console.error("Mood analysis error:", e);
    return null;
  }
};

export const getLatestAdvice = async (): Promise<AdviceResponse | null> => {
  try {
    const activeClient = await initializeGenLayer();
    if (!activeClient) {
      return null;
    }

    let result: any = null;

    // Strategy 1: Try readContract with no args
    console.log("getLatestAdvice: attempting readContract (no args)");
    try {
      result = await activeClient.readContract({
        address: CONTRACT_ADDRESS,
        functionName: "get_latest_advice",
      });
      console.log("getLatestAdvice: readContract succeeded, result:", result);
    } catch (err1: any) {
      console.warn("getLatestAdvice: readContract (no args) failed:", err1?.message);

      // Strategy 2: Try readContract with explicit empty args array
      console.log("getLatestAdvice: attempting readContract (with empty args)");
      try {
        result = await activeClient.readContract({
          address: CONTRACT_ADDRESS,
          functionName: "get_latest_advice",
          args: [],
        });
        console.log("getLatestAdvice: readContract (with args) succeeded, result:", result);
      } catch (err2: any) {
        console.warn("getLatestAdvice: readContract (with args) failed:", err2?.message);

        // Strategy 3: Try callContract (lower-level, bypass ABI decoding)
        console.log("getLatestAdvice: attempting callContract (raw call)");
        try {
          result = await activeClient.callContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_latest_advice",
          });
          console.log("getLatestAdvice: callContract succeeded, result:", result);
        } catch (err3: any) {
          console.warn("getLatestAdvice: callContract failed:", err3?.message);

          // Strategy 4: Try with from address
          const fromAddress = (activeClient.account && activeClient.account.address) ||
            (typeof activeClient.getAddress === "function" ? await activeClient.getAddress() : undefined) ||
            undefined;

          if (fromAddress) {
            console.log("getLatestAdvice: attempting callContract with from address:", fromAddress);
            try {
              result = await activeClient.callContract({
                address: CONTRACT_ADDRESS,
                functionName: "get_latest_advice",
                from: fromAddress,
              });
              console.log("getLatestAdvice: callContract (with from) succeeded, result:", result);
            } catch (err4: any) {
              console.error("getLatestAdvice: all strategies failed. Last error:", err4?.message);
              throw err4;
            }
          } else {
            throw err3;
          }
        }
      }
    }

    // Try to parse and normalize the response into an AdviceResponse-friendly shape
    const defaultAdvice = "Take a moment to breathe and reflect on your day.";
    const defaultAction = "Try a 5-minute meditation.";

    const normalize = (res: any): { advice: string; suggested_action: string } => {
      if (res == null) return { advice: defaultAdvice, suggested_action: defaultAction };

      // If it's a string, try to parse JSON, extract embedded JSON, or return as-is
      if (typeof res === "string") {
        const s = res.trim();
        try {
          const parsed = JSON.parse(s);
          return normalize(parsed);
        } catch {}

        // Try to extract an object/array substring
        const objStart = s.indexOf("{");
        const arrStart = s.indexOf("[");
        if (objStart !== -1) {
          const objEnd = s.lastIndexOf("}");
          if (objEnd > objStart) {
            const candidate = s.slice(objStart, objEnd + 1);
            try {
              return normalize(JSON.parse(candidate));
            } catch {}
          }
        }
        if (arrStart !== -1) {
          const arrEnd = s.lastIndexOf("]");
          if (arrEnd > arrStart) {
            const candidate = s.slice(arrStart, arrEnd + 1);
            try {
              return normalize(JSON.parse(candidate));
            } catch {}
          }
        }

        return { advice: s, suggested_action: defaultAction };
      }

      // Arrays: use first element if possible
      if (Array.isArray(res)) {
        if (res.length === 0) return { advice: defaultAdvice, suggested_action: defaultAction };
        return normalize(res[0]);
      }

      // Uint8Array / Buffer-like -> decode to text
      try {
        if (typeof Uint8Array !== "undefined" && res instanceof Uint8Array) {
          const text = new TextDecoder().decode(res);
          return normalize(text);
        }
        // Node Buffer-ish
        if (res && typeof res === "object" && res.type === "Buffer" && Array.isArray(res.data)) {
          const text = new TextDecoder().decode(Uint8Array.from(res.data));
          return normalize(text);
        }
      } catch {}

      // Objects: check direct fields
      if (typeof res === "object") {
        if (typeof res.advice === "string" || typeof res.suggested_action === "string") {
          return {
            advice: typeof res.advice === "string" ? res.advice : defaultAdvice,
            suggested_action: typeof res.suggested_action === "string" ? res.suggested_action : defaultAction,
          };
        }

        // Look for common wrapper fields
        for (const k of ["result", "value", "data", "response"]) {
          if (res[k]) return normalize(res[k]);
        }

        // Search object values for embedded JSON strings
        for (const key of Object.keys(res)) {
          const v = res[key];
          if (typeof v === "string") {
            const trimmed = v.trim();
            if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
              try {
                return normalize(JSON.parse(trimmed));
              } catch {}
            }
          }
        }

        // Fallback: stringify the object and return
        try {
          return { advice: JSON.stringify(res), suggested_action: defaultAction };
        } catch {
          return { advice: defaultAdvice, suggested_action: defaultAction };
        }
      }

      // Fallback for other types
      return { advice: String(res), suggested_action: defaultAction };
    };

    try {
      const normalized = normalize(result);
      console.log("getLatestAdvice: normalized result:", normalized);
      return normalized;
    } catch (normErr) {
      console.error("getLatestAdvice: normalization failed:", normErr);
      return { advice: defaultAdvice, suggested_action: defaultAction };
    }
  } catch (e) {
    console.error("Read advice error:", e);
    return null;
  }
};
