import { Shield, TrendingUp, Map, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10"
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-glow" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-card/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              DriveGuard
            </h1>
          </div>
          <Button onClick={() => navigate("/selector")} className="gap-2 group relative overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6 backdrop-blur-sm animate-glow">
              <Sparkles className="h-4 w-4" />
              Real-time Risk Analysis for Portuguese Roads
            </div>
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-bold leading-tight animate-fade-in-up">
            Drive Safer with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
              AI Intelligence
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
            DriveGuard combines real-time traffic data and weather conditions across Portugal 
            to generate AI-powered risk predictions, helping you make informed decisions before you hit the road.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/selector")}
              className="gap-2 text-lg px-10 py-7 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Risk Map
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 text-lg px-10 py-7 backdrop-blur-sm bg-card/30 border-primary/30 hover:bg-card/50 hover:border-primary/50"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20 animate-scale-in" style={{ animationDelay: "600ms" }}>
          {[
            { label: "Regions", value: "12+" },
            { label: "Data Sources", value: "Real-time" },
            { label: "Accuracy", value: "95%" },
            { label: "Updates", value: "Live" }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl backdrop-blur-xl bg-card/40 border border-border/50 hover:border-primary/50 transition-all hover:scale-105 group">
              <div className="text-3xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-4">Intelligent Safety Features</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Powered by advanced AI and real-time data integration
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            {
              icon: Map,
              color: "success",
              title: "Interactive Risk Maps",
              description: "Visualize accident risk levels across Portuguese regions with color-coded overlays. Green for safe, amber for caution, red for high-risk areas.",
              delay: 0
            },
            {
              icon: TrendingUp,
              color: "primary",
              title: "Real-Time Data",
              description: "Powered by live traffic and weather APIs specific to Portugal, ensuring you always have the most current risk assessments.",
              delay: 200
            },
            {
              icon: Shield,
              color: "warning",
              title: "AI Predictions",
              description: "Advanced algorithms analyze patterns to predict accident probabilities, helping you choose safer routes and travel times.",
              delay: 400
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection key={i} delay={feature.delay}>
                <div className="group p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-b from-card/60 to-card/40 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 relative overflow-hidden h-full">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 text-${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
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
      <section className="container mx-auto px-4 py-20 relative">
        <AnimatedSection>
          <h2 className="text-5xl font-bold text-center mb-20">How DriveGuard Works</h2>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto space-y-16">
          {[
            {
              num: "1",
              title: "Select Your Region",
              desc: "Choose from Portuguese districts including Lisboa, Porto, Faro, and more to focus on your area of interest."
            },
            {
              num: "2",
              title: "View Risk Analysis",
              desc: "See real-time risk predictions displayed on an interactive map with color-coded zones showing safety levels."
            },
            {
              num: "3",
              title: "Make Informed Decisions",
              desc: "Use the risk data to plan safer routes, adjust travel times, or take extra precautions in high-risk areas."
            }
          ].map((step, i) => (
            <AnimatedSection key={i} delay={i * 200}>
              <div className="flex gap-8 items-start group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
                  {step.num}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
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
              className="gap-2 px-10 py-7 text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Using DriveGuard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-20 backdrop-blur-xl bg-card/20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 DriveGuard. Enhancing road safety through intelligent risk prediction.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
