# Mood Analyzer
**Mood Analyzer** is a modern, light-themed web application that provides personalized, human-like advice based on your emotional state. By assessing 22 distinct emotional dimensions, the app communicates with an **Intelligent Contract** on GenLayer to generate empathetic guidance and suggested actions.

---

## 🌟 Key Features

* **Deep Emotional Assessment:** Covers 22 specific metrics including Joy, Bravery, Burnout, and Gratitude.
* **Intuitive UI:** A clean, light-themed landing page with smooth transitions between assessment steps.
* **AI Life Coach:** Unlike robotic tools, this uses GenLayer's AI consensus to provide warm, conversational advice.
* **Blockchain Secured:** Your mood analysis is processed and stored as a verifiable state on the GenLayer Studionet.

---

## 🛠️ Smart Contract Details

**Contract Address:** `0x8C1308405Cec94423E91d115584e7267dcB75a47`

### Methods

| Method | Type | Description |
| --- | --- | --- |
| `analyze_mood(mood_data)` | **Write** | Sends the ratings to the AI for analysis. |
| `get_latest_advice()` | **View** | Retrieves the warm, human-like advice JSON. |

---

## 🎮 How It Works

1. **Landing Page:** Users click **"Enter"** to start.
2. **Assessment:** Users rate 22 emotions from 1 to 5 (e.g., *Joyful: "Content" to "Euphoric"*).
3. **Analysis:** The app calls `analyze_mood` via the `genlayer-js` SDK.
4. **Instant Feedback:** Once the transaction is `ACCEPTED`, the app immediately calls `get_latest_advice`.
5. **Human Response:** The app parses the JSON and displays the advice and suggested action in a warm, friendly format.

---

## 🚀 Technical Implementation (Kenny's Integration)

Following the **GenLayer Contract Interaction Guide**, the app uses a custom hook/utility to manage blockchain communication.

### Configuration

1. **Dependencies:** `npm install genlayer-js`
2. **Setup:** Uses Vite for fast environment variable handling.

### Core Logic Snippet (`src/lib/genlayer.tsx`)

```javascript
import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const CONTRACT_ADDRESS = "0x74bC2206460C21413925ED3Ce9A1aE1675E1b99a";

// 1. Initialize Client
// 2. Call analyze_mood (Write)
export const sendMoodData = async (curatedData) => {
  const activeClient = await initializeGenLayer();
  const hash = await activeClient.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "analyze_mood",
    args: [curatedData],
  });

  // 3. Wait for ACCEPTED status
  await activeClient.waitForTransactionReceipt({ hash, status: "ACCEPTED" });

  // 4. Immediately fetch the human advice
  return await fetchAdvice();
};

// 5. Read get_latest_advice (View)
export const fetchAdvice = async () => {
  const activeClient = await initializeGenLayer();
  const result = await activeClient.readContract({
    address: CONTRACT_ADDRESS,
    functionName: "get_latest_advice",
    args: [],
  });
  return JSON.parse(result); // Dapp is built to handle parsing safely
};

```
---

## 📊 Emotional Dimensions Measured

The contract analyzes a spectrum including:

* **Joyful:** Content → Euphoric
* **Anxiety:** Uneasy → Panic
* **Focus:** Distracted → Flow State
* **Burnout:** Tired → Physically Drained
* *And 18 others...*

