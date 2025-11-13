import { Shield, TrendingUp, Map, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DriveGuard
            </h1>
          </div>
          <Button onClick={() => navigate("/selector")} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <AlertTriangle className="h-4 w-4" />
            Real-time Risk Analysis for Portuguese Roads
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
            Drive Safer with{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-destructive bg-clip-text text-transparent">
              Predictive Intelligence
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DriveGuard combines real-time traffic data and weather conditions across Portugal 
            to generate AI-powered risk predictions, helping you make informed decisions before you hit the road.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/selector")}
              className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Explore Risk Map
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <Map className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interactive Risk Maps</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visualize accident risk levels across Portuguese regions with color-coded overlays. 
              Green for safe, amber for caution, red for high-risk areas.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Data Integration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Powered by live traffic and weather APIs specific to Portugal, 
              ensuring you always have the most current risk assessments.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Predictions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced algorithms analyze patterns to predict accident probabilities, 
              helping you choose safer routes and travel times.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How DriveGuard Works</h2>
          
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Select Your Region</h3>
                <p className="text-muted-foreground">
                  Choose from Portuguese districts including Lisboa, Porto, Faro, and more to focus on your area of interest.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">View Risk Analysis</h3>
                <p className="text-muted-foreground">
                  See real-time risk predictions displayed on an interactive map with color-coded zones showing safety levels.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Make Informed Decisions</h3>
                <p className="text-muted-foreground">
                  Use the risk data to plan safer routes, adjust travel times, or take extra precautions in high-risk areas.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/selector")}
              className="gap-2"
            >
              Start Using DriveGuard
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 DriveGuard. Enhancing road safety through intelligent risk prediction.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
