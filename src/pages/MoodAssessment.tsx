import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MoodSlider from "@/components/MoodSlider";
import { analyzeMood, MoodData } from "@/lib/genlayer";
import { useToast } from "@/hooks/use-toast";

const moodQuestions = [
  { key: "joyful", label: "Joyful", lowLabel: "Content", highLabel: "Euphoric" },
  { key: "melancholy", label: "Melancholy", lowLabel: "Pensive", highLabel: "Deeply Sad" },
  { key: "energy", label: "Energy", lowLabel: "Exhausted", highLabel: "Hyperactive" },
  { key: "bravery", label: "Bravery", lowLabel: "Paralyzed", highLabel: "Fearless" },
  { key: "focus", label: "Focus", lowLabel: "Distracted", highLabel: "Flow State" },
  { key: "irritation", label: "Irritation", lowLabel: "Calm", highLabel: "Enraged" },
  { key: "social", label: "Social", lowLabel: "Withdrawn", highLabel: "Outgoing" },
  { key: "anxiety", label: "Anxiety", lowLabel: "Uneasy", highLabel: "Panic" },
  { key: "anger", label: "Anger", lowLabel: "Annoyed", highLabel: "Livid" },
  { key: "excitement", label: "Excitement", lowLabel: "Interested", highLabel: "Thrilled" },
  { key: "confidence", label: "Confidence", lowLabel: "Uncertain", highLabel: "Unstoppable" },
  { key: "burnout", label: "Burnout", lowLabel: "Tired", highLabel: "Physically Drained" },
  { key: "loneliness", label: "Loneliness", lowLabel: "Solitary", highLabel: "Isolated" },
  { key: "peace", label: "Peace", lowLabel: "Quiet", highLabel: "Deep Serenity" },
  { key: "boredom", label: "Boredom", lowLabel: "Disengaged", highLabel: "Apathetic" },
  { key: "productivity", label: "Productivity", lowLabel: "Stagnant", highLabel: "Flow State" },
  { key: "confusion", label: "Confusion", lowLabel: "Vague", highLabel: "Overwhelmed" },
  { key: "gratitude", label: "Gratitude", lowLabel: "Aware", highLabel: "Deeply Thankful" },
  { key: "insecurity", label: "Insecurity", lowLabel: "Self-conscious", highLabel: "Inadequate" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const MoodAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [[currentStep, direction], setPage] = useState([0, 0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodValues, setMoodValues] = useState<Record<string, number>>(
    Object.fromEntries(moodQuestions.map((q) => [q.key, 3]))
  );

  const currentQuestion = moodQuestions[currentStep];
  const progress = ((currentStep + 1) / moodQuestions.length) * 100;

  const paginate = (newDirection: number) => {
    const nextStep = currentStep + newDirection;
    if (nextStep >= 0 && nextStep < moodQuestions.length) {
      setPage([nextStep, newDirection]);
    }
  };

  const handleValueChange = (value: number) => {
    setMoodValues((prev) => ({ ...prev, [currentQuestion.key]: value }));
    
    // Auto-advance after selection with a slight delay
    if (currentStep < moodQuestions.length - 1) {
      setTimeout(() => {
        paginate(1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const moodData: MoodData = {
        joyful: moodValues.joyful,
        melancholy: moodValues.melancholy,
        energy: moodValues.energy,
        bravery: moodValues.bravery,
        focus: moodValues.focus,
        irritation: moodValues.irritation,
        social: moodValues.social,
        anxiety: moodValues.anxiety,
        anger: moodValues.anger,
        excitement: moodValues.excitement,
        confidence: moodValues.confidence,
        burnout: moodValues.burnout,
        loneliness: moodValues.loneliness,
        peace: moodValues.peace,
        boredom: moodValues.boredom,
        productivity: moodValues.productivity,
        confusion: moodValues.confusion,
        gratitude: moodValues.gratitude,
        insecurity: moodValues.insecurity,
      };
      const result = await analyzeMood(moodData);

      if (result) {
        navigate("/results", { state: { advice: result, moodData } });
      } else {
        toast({
          title: "Connection Required",
          description: "Please configure your GenLayer key to receive AI advice. Showing sample results.",
          variant: "destructive",
        });
        navigate("/results", {
          state: {
            advice: {
              advice: "Based on your emotional profile, it seems you're experiencing a mix of feelings today. Remember that all emotions are valid and temporary. Take this moment to acknowledge how you feel without judgment.",
              suggested_action: "Try a 10-minute walk outside to clear your mind and reset your energy.",
            },
            moodData: moodValues,
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress bar */}
        <div className="w-full h-1 bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            {currentStep + 1} of {moodQuestions.length}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full max-w-xl"
            >
              <MoodSlider
                label={currentQuestion.label}
                lowLabel={currentQuestion.lowLabel}
                highLabel={currentQuestion.highLabel}
                value={moodValues[currentQuestion.key]}
                onChange={handleValueChange}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-8">
          <button
            onClick={() => paginate(-1)}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-muted text-muted-foreground font-medium transition-all hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < moodQuestions.length - 1 ? (
            <button
              onClick={() => paginate(1)}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all hover:shadow-glow hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, hsl(174 42% 50%) 0%, hsl(174 50% 40%) 100%)" }}
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all hover:shadow-glow hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, hsl(25 80% 65%) 0%, hsl(25 70% 55%) 100%)" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Get My Insights
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodAssessment;
