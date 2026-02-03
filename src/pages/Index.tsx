import { useNavigate } from "react-router-dom";
import { Sparkles, Heart, Brain } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-2xl animate-slide-up">
          {/* Icon cluster */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="p-4 glass-card rounded-2xl animate-float">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <div className="p-4 glass-card rounded-2xl animate-float" style={{ animationDelay: "0.5s" }}>
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div className="p-4 glass-card rounded-2xl animate-float" style={{ animationDelay: "1s" }}>
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="gradient-text">Mood</span>
            <br />
            <span className="text-foreground">Analyzer</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Understand your emotions with AI-powered insights. Get personalized advice tailored to how you feel.
          </p>

          {/* Enter button */}
          <button
            onClick={() => navigate("/assessment")}
            className="group relative mt-8 px-12 py-5 text-white font-semibold text-lg rounded-full shadow-elevated hover:shadow-glow transition-all duration-500 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, hsl(174 42% 50%) 0%, hsl(174 50% 40%) 100%)" }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Begin Your Journey
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
