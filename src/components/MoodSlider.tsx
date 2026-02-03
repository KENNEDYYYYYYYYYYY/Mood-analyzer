import { Slider } from "@/components/ui/slider";

interface MoodSliderProps {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider = ({ label, lowLabel, highLabel, value, onChange }: MoodSliderProps) => {
  const getEmoji = () => {
    if (value <= 2) return "😌";
    if (value === 3) return "😐";
    return "😤";
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
          {label}
        </h2>
        <p className="text-lg text-muted-foreground">
          How would you rate this feeling right now?
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 md:p-12 space-y-8">
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-muted-foreground font-medium">{lowLabel}</span>
          <span className="text-muted-foreground font-medium">{highLabel}</span>
        </div>

        <div className="relative py-4">
          <Slider
            value={[value]}
            onValueChange={(vals) => onChange(vals[0])}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onChange(num)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full font-semibold text-lg transition-all duration-300 ${
                  value === num
                    ? "bg-primary text-primary-foreground shadow-glow scale-110"
                    : "bg-muted text-muted-foreground hover:bg-primary/20"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <span className="text-6xl">{getEmoji()}</span>
        </div>
      </div>
    </div>
  );
};

export default MoodSlider;
