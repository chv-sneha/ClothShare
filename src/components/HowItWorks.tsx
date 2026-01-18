import { Shirt, Sparkles, MapPin, Heart } from 'lucide-react';

const steps = [
  {
    icon: Shirt,
    title: 'Add Your Clothes',
    description: 'Select the type, gender, season, and condition of clothes you want to donate.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Sparkles,
    title: 'AI Analyzes Needs',
    description: 'Our smart system matches your items with current needs of local donation centers.',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: MapPin,
    title: 'Get Matched',
    description: 'Receive personalized recommendations with the best places to donate.',
    color: 'bg-secondary text-secondary-foreground',
  },
  {
    icon: Heart,
    title: 'Make an Impact',
    description: 'Your clothes reach people who truly need them, reducing waste and spreading warmth.',
    color: 'bg-success/10 text-success',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Four simple steps to ensure your clothes make the biggest impact
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-border" />

            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Icon */}
                <div className={`w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-soft`}>
                  <step.icon className="w-10 h-10" />
                </div>

                {/* Step number */}
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold z-20">
                  {index + 1}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
