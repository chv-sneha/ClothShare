import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, HelpCircle, Gift, History, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Navigation overlay on SVG */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-bold text-xl text-white drop-shadow-lg">
              ClothShare
            </span>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              How it works
            </button>
            <button 
              onClick={onGetStarted}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Donate
            </button>
            <button 
              onClick={() => navigate('/centers')}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Centers
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
          
          {!user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      {/* SVG Background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full h-full flex items-center justify-center"
        >
          <img 
            src="/Gold Modern Donations to Humanity YouTube Thumbnail.svg" 
            alt="ClothShare - Donations to Humanity" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Overlay content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gradient-warm text-primary-foreground px-8 py-6 text-lg font-semibold shadow-elevated hover:shadow-card transition-shadow bg-primary/90 backdrop-blur-sm"
            >
              Start Donating
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
