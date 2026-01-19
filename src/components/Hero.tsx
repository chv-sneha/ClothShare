import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, HelpCircle, Gift, History, MapPin, Menu, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/hooks/useLocation';
import { useState } from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Navigation overlay on SVG */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 sm:w-10 sm:h-10 gradient-warm rounded-xl flex items-center justify-center"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-bold text-lg sm:text-xl text-white drop-shadow-lg">
              ClothShare
            </span>
          </div>
          
          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm xl:text-base"
            >
              <HelpCircle className="w-4 h-4" />
              How it works
            </button>
            <button 
              onClick={onGetStarted}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm xl:text-base"
            >
              <Gift className="w-4 h-4" />
              Donate
            </button>
            <button 
              onClick={() => navigate('/centers')}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm xl:text-base"
            >
              <MapPin className="w-4 h-4" />
              Centers
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm xl:text-base"
            >
              <History className="w-4 h-4" />
              History
            </button>
          </div>
          
          {/* Desktop Sign In */}
          <div className="hidden sm:block">
            {!user && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all text-sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mt-4"
            >
              <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 space-y-3">
                <button 
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white/90 hover:text-white transition-colors flex items-center gap-3 p-2 rounded hover:bg-white/10"
                >
                  <HelpCircle className="w-4 h-4" />
                  How it works
                </button>
                <button 
                  onClick={() => {
                    onGetStarted();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white/90 hover:text-white transition-colors flex items-center gap-3 p-2 rounded hover:bg-white/10"
                >
                  <Gift className="w-4 h-4" />
                  Donate
                </button>
                <button 
                  onClick={() => {
                    navigate('/centers');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white/90 hover:text-white transition-colors flex items-center gap-3 p-2 rounded hover:bg-white/10"
                >
                  <MapPin className="w-4 h-4" />
                  Centers
                </button>
                <button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-white/90 hover:text-white transition-colors flex items-center gap-3 p-2 rounded hover:bg-white/10"
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                {!user && (
                  <Button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all mt-3"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          className="text-center mt-24 sm:mt-16"
        >
          {/* Location Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm">
              {location.loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Detecting your location...</span>
                </>
              ) : location.error ? (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>Location access needed</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span className="max-w-xs truncate">
                    {location.address || 'Location detected'}
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gradient-warm text-primary-foreground px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold shadow-elevated hover:shadow-card transition-shadow bg-primary/90 backdrop-blur-sm"
            >
              Start Donating
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
