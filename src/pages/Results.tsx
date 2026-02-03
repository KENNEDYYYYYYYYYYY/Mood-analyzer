import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Sparkles, RefreshCw, Home, Lightbulb, Heart } from "lucide-react";
import { AdviceResponse, MoodData } from "@/lib/genlayer";

interface LocationState {
  advice: AdviceResponse;
  moodData: MoodData;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state?.advice) {
    return <Navigate to="/" replace />;
  }

  const { advice, moodData } = state;

  // Calculate dominant emotions
  const getDominantEmotions = () => {
    const entries = Object.entries(moodData);
    const sorted = entries.sort((a, b) => (b[1] as number) - (a[1] as number));
    return sorted.slice(0, 3).map(([key]) => key);
  };

  const dominantEmotions = getDominantEmotions();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8 animate-slide-up">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 glass-card rounded-2xl mb-4">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Your <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Based on your emotional profile
            </p>
          </div>

          {/* Dominant emotions */}
          <div className="flex justify-center gap-3 flex-wrap">
            {dominantEmotions.map((emotion) => (
              <span
                key={emotion}
                className="px-4 py-2 glass-card rounded-full text-sm font-medium text-primary capitalize"
              >
                {emotion}
              </span>
            ))}
          </div>

          {/* Advice card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Personalized Advice
                </h2>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  {advice.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Action card */}
          <div className="glass-card rounded-3xl p-8 md:p-10 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Suggested Action
                </h2>
                <p className="text-foreground/80 text-lg leading-relaxed">
                  {advice.suggested_action}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--gradient-button)] text-primary-foreground font-semibold transition-all hover:shadow-glow hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Analyze Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-muted text-muted-foreground font-semibold transition-all hover:bg-muted/80"
            >
              <Home className="w-5 h-5" />
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
