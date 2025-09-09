import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FlowBoard
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            {user ? (
              <Link to="/whiteboard">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  Go to Whiteboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Visual collaboration
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              made simple
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, collaborate, and innovate with our intuitive whiteboard platform. 
            Perfect for teams, designers, and creative professionals.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/whiteboard">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to collaborate</h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools designed for seamless teamwork and creativity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Real-time collaboration with instant updates across all devices
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with your team members in real-time
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card shadow-soft">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intuitive Design</h3>
              <p className="text-muted-foreground">
                Beautiful, easy-to-use interface that gets out of your way
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using FlowBoard to bring their ideas to life.
          </p>
          <Link to="/whiteboard">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-3">
              Start Your Free Whiteboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FlowBoard
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 FlowBoard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
