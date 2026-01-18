import { motion } from 'framer-motion';
import { Heart, ArrowDown, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { Badge } from '@/components/ui/badge';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const location = useLocation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '15%', left: '8%', size: 80, delay: 0, color: 'bg-primary/15' },
          { top: '25%', right: '12%', size: 60, delay: 0.5, color: 'bg-secondary/40' },
          { bottom: '30%', left: '20%', size: 50, delay: 1, color: 'bg-accent/15' },
          { bottom: '15%', right: '25%', size: 90, delay: 1.5, color: 'bg-primary/10' },
        ].map((shape, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute rounded-full ${shape.color}`}
            style={{
              top: shape.top,
              left: shape.left,
              right: shape.right,
              bottom: shape.bottom,
              width: shape.size,
              height: shape.size,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Location Badge */}
          {!location.loading && !location.error && location.address && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <Badge variant="outline" className="px-4 py-2 bg-card/80 backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1 text-primary" />
                <span className="text-xs">{location.address.split(',').slice(0, 2).join(',')}</span>
              </Badge>
            </motion.div>
          )}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">AI-Powered Smart Matching</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6"
          >
            Give Clothes a{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Second Life</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -rotate-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Connect your unused clothes with the right donation centers.
            Our AI finds the perfect match between what you have and who needs it most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={onGetStarted}
                className="gradient-warm text-primary-foreground px-8 py-6 text-lg font-semibold shadow-elevated hover:shadow-card transition-shadow"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Donating
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-2 hover:bg-secondary/50 transition-colors"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            {[
              { value: '500+', label: 'Clothes Donated' },
              { value: '15+', label: 'Partner Centers' },
              { value: '98%', label: 'Match Accuracy' },
            ].map((stat) => (
              <motion.div key={stat.label} className="text-center" whileHover={{ y: -5 }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>
    </section>
  );
}
