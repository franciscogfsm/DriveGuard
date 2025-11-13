import {
  Shield,
  TrendingUp,
  Map,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dramatic Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 z-10" />

        {/* Background Image - Emergency/Accident Scene */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop')",
            filter: "brightness(0.7) saturate(0.8)",
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-[120px] animate-float z-20" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] animate-float z-20"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-glow z-20" />

        {/* Grid overlay for tech feel */}
        <div
          className="absolute inset-0 z-20 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              DriveGuard
            </h1>
          </div>
          <Button
            onClick={() => navigate("/selector")}
            className="gap-2 group relative overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32 relative z-30">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 border border-red-500/40 text-red-400 text-sm font-medium mb-6 backdrop-blur-sm animate-glow">
              <AlertTriangle className="h-4 w-4" />
              Real-time Risk Analysis for Portuguese Roads
            </div>
          </div>

          <h2 className="text-6xl lg:text-8xl font-bold leading-tight animate-fade-in-up text-white drop-shadow-2xl">
            Drive Safer with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-glow drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              AI Intelligence
            </span>
          </h2>

          <p
            className="text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in drop-shadow-lg"
            style={{ animationDelay: "200ms" }}
          >
            <span className="font-semibold text-cyan-400">
              Improving Emergency Response Times
            </span>{" "}
            by analyzing accident risks through real-time weather conditions,
            traffic congestion, and road safety data across Portugal.
          </p>

          {/* Mission Statement Box */}
          <div
            className="animate-fade-in mx-auto max-w-2xl"
            style={{ animationDelay: "300ms" }}
          >
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 shadow-2xl">
              <div className="flex items-start gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/50">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Reduce accident response times and save lives by predicting
                    high-risk zones through AI analysis of rain, traffic
                    congestion, visibility, and historical accident data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/selector")}
              className="gap-2 text-lg px-10 py-7 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-2xl shadow-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold">
                Explore Risk Map
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg px-10 py-7 backdrop-blur-sm bg-white/5 border-white/30 hover:bg-white/10 hover:border-white/50 text-white font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20 animate-scale-in"
          style={{ animationDelay: "600ms" }}
        >
          {[
            { label: "Regions Covered", value: "12+", icon: Map },
            { label: "Data Sources", value: "Real-time", icon: TrendingUp },
            { label: "Risk Accuracy", value: "95%", icon: Shield },
            { label: "Live Updates", value: "24/7", icon: Sparkles },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-400/50 transition-all hover:scale-105 group shadow-xl"
              >
                <Icon className="h-8 w-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-30">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-4 text-white drop-shadow-lg">
            Intelligent Safety Features
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16 max-w-2xl mx-auto drop-shadow">
            Powered by advanced AI and real-time data integration to predict and
            prevent accidents
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            {
              icon: Map,
              color: "from-green-500 to-emerald-600",
              glowColor: "shadow-green-500/50",
              title: "Interactive Risk Maps",
              description:
                "Visualize accident risk levels across Portuguese regions with color-coded overlays. Green for safe, amber for caution, red for high-risk areas based on weather and traffic conditions.",
              delay: 0,
            },
            {
              icon: TrendingUp,
              color: "from-blue-500 to-cyan-600",
              glowColor: "shadow-blue-500/50",
              title: "Real-Time Weather & Traffic",
              description:
                "Live monitoring of rain, visibility, wind conditions, and traffic congestion. Analyzes how weather impacts accident probability to help emergency services prepare.",
              delay: 200,
            },
            {
              icon: Shield,
              color: "from-amber-500 to-orange-600",
              glowColor: "shadow-amber-500/50",
              title: "AI Risk Predictions",
              description:
                "Advanced algorithms predict accident hotspots by combining weather patterns, traffic density, time of day, and historical incident data for proactive safety.",
              delay: 400,
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={i} delay={feature.delay}>
                <div className="group p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/20 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 relative overflow-hidden h-full shadow-2xl">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl ${feature.glowColor}`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 relative z-30">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-20 text-white drop-shadow-lg">
            How DriveGuard Works
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto space-y-16">
          {[
            {
              num: "1",
              title: "Select Your Region",
              desc: "Choose from Portuguese districts including Lisboa, Porto, Faro, and more to focus on your area of interest and view localized risk data.",
              gradient: "from-blue-500 to-cyan-600",
            },
            {
              num: "2",
              title: "Analyze Risk Factors",
              desc: "AI analyzes real-time weather (rain, wind, visibility), traffic congestion, time of day, and historical accident data to calculate risk scores for each zone.",
              gradient: "from-cyan-500 to-blue-600",
            },
            {
              num: "3",
              title: "Improve Response Times",
              desc: "Emergency services and drivers use risk predictions to prepare for high-risk areas, reducing response times and preventing accidents before they happen.",
              gradient: "from-blue-600 to-cyan-500",
            },
          ].map((step, i) => (
            <AnimatedSection key={i} delay={i * 200}>
              <div className="flex gap-8 items-start group">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center font-bold text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-blue-500/40 text-white`}
                >
                  {step.num}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={600}>
          <div className="text-center mt-20">
            <Button
              size="lg"
              onClick={() => navigate("/selector")}
              className="gap-2 px-10 py-7 text-lg group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-2xl shadow-blue-500/50 font-semibold"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Using DriveGuard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 backdrop-blur-xl bg-black/30 relative z-30">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>
            © 2025 DriveGuard.{" "}
            <span className="text-cyan-400 font-semibold">Saving lives</span>{" "}
            through intelligent risk prediction and faster emergency response.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
