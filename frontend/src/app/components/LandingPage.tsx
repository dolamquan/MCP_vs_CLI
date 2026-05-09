import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Terminal, Zap, DollarSign, TrendingUp, Code2, Activity } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

export function LandingPage() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-6 h-6 text-green-400" />
                <span className="text-xl tracking-tight">CLI vs MCP</span>
              </div>
              <div className="text-xs text-gray-400 ml-8">Token Analyzer</div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
              <a href="#overview" onClick={(e) => handleSmoothScroll(e, '#overview')} className="hover:text-green-400 transition-colors duration-300">Overview</a>
              <a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="hover:text-green-400 transition-colors duration-300">Features</a>
              <a href="#compare" onClick={(e) => handleSmoothScroll(e, '#compare')} className="hover:text-green-400 transition-colors duration-300">Compare</a>
              <a href="#docs" onClick={(e) => handleSmoothScroll(e, '#docs')} className="hover:text-green-400 transition-colors duration-300">Docs</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-green-500 hover:bg-green-600 text-black">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <HeroBackground />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl md:text-8xl tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            >
              COMPARE CLI AND MCP TOKEN USAGE
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            >
              Track token consumption, estimate cost, and discover which AI workflow is more efficient.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
            >
              <Link to="/dashboard">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black text-lg px-8 py-6">
                  Analyze Commands
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white text-lg px-8 py-6">
                View Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Image + Text Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwc2NyZWVufGVufDF8fHx8MTc3ODExOTU3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
                Real-Time Token Analytics
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                Track every token consumed by your AI workflows in real-time. Get instant insights into cost patterns and efficiency metrics.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div>
                    <div className="text-white">Live Monitoring</div>
                    <div className="text-gray-500">Watch token usage as it happens</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div>
                    <div className="text-white">Cost Breakdown</div>
                    <div className="text-gray-500">Understand where every dollar goes</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div>
                    <div className="text-white">Historical Trends</div>
                    <div className="text-gray-500">Analyze patterns over time</div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="overview" className="py-32 relative bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
              AI WORKFLOWS SPEND TOKENS DIFFERENTLY
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              CLI commands and MCP tool calls may complete similar tasks, but they can use different amounts of context, output, and cost.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Terminal,
                title: "CLI COMMAND ANALYSIS",
                description: "Estimate input tokens, output tokens, and cost from CLI commands.",
                delay: 0,
              },
              {
                icon: Zap,
                title: "MCP TOOL COMPARISON",
                description: "Compare MCP tool calls against CLI workflows.",
                delay: 0.2,
              },
              {
                icon: DollarSign,
                title: "COST & TOKEN INSIGHTS",
                description: "Break down usage by model, command type, and estimated cost.",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: feature.delay, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-green-500/30 transition-all h-full group cursor-pointer">
                  <CardHeader>
                    <motion.div
                      className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-6 h-6 text-green-400" />
                    </motion.div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Image Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
                Built for Development Teams
              </h2>
              <p className="text-xl text-gray-400 mb-6">
                Collaborate with your team to optimize AI workflows. Share insights, compare strategies, and reduce costs together.
              </p>
              <div className="flex gap-4">
                <Link to="/dashboard">
                  <Button className="bg-green-500 hover:bg-green-600 text-black">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmclMjBidXNpbmVzc3xlbnwxfHx8fDE3NzgyNzgxNzd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Team Collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 mix-blend-overlay" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
          initial={{ y: 0 }}
          whileInView={{ y: -50 }}
          viewport={{ once: false }}
          transition={{ duration: 3, ease: "easeOut" }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
              SEE YOUR TOKEN USAGE IN REAL TIME
            </h2>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
              whileHover={{ boxShadow: "0 0 40px rgba(34, 197, 94, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Mock dashboard */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Input Tokens", value: "1,248", color: "text-white" },
                  { label: "Output Tokens", value: "620", color: "text-white" },
                  { label: "Estimated Cost", value: "$0.0042", color: "text-green-400" },
                  { label: "Efficiency Score", value: "87%", color: "text-white" },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } }}
                  >
                    <Card className="bg-black/40 border-white/10 hover:border-green-500/30 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400">{metric.label}</CardDescription>
                        <CardTitle className={`text-3xl ${metric.color}`}>{metric.value}</CardTitle>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="bg-black/40 border border-white/10 rounded-lg p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-48 flex items-center justify-center text-gray-500 relative z-10">
                  <Activity className="w-8 h-8 mr-2" />
                  Token usage graph visualization
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Workspace Image Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="order-2 md:order-1"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1762341123207-534f965910df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5JTIwbGFwdG9wfGVufDF8fHx8MTc3ODI3ODE3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2"
            >
              <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
                Optimize Every Workflow
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Whether you're using CLI commands or MCP tool calls, get actionable recommendations to reduce token usage and save on costs.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="text-3xl mb-2">89%</div>
                  <div className="text-sm text-gray-400">Average Efficiency</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="text-3xl mb-2 text-green-400">-34%</div>
                  <div className="text-sm text-gray-400">Cost Reduction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="compare" className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* CLI Panel */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                whileHover={{ scale: 1.02, x: -5, transition: { duration: 0.4, ease: "easeOut" } }}
              >
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Terminal className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white">CLI</CardTitle>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <code className="text-sm text-blue-300">
                      npm run analyze -- --model gpt-4.1
                    </code>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-white">890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Output:</span>
                    <span className="text-white">410</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-blue-400">$0.0029</span>
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              {/* MCP Panel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.4, ease: "easeOut" } }}
              >
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-white">MCP</CardTitle>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <code className="text-sm text-purple-300">
                      mcp.callTool("analyze_project")
                    </code>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-white">1,320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Output:</span>
                    <span className="text-white">500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-purple-400">$0.0041</span>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-6 py-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-green-400">CLI is 29% cheaper in this run</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-width Image Section */}
      <section className="py-0 relative overflow-hidden">
        <motion.div
          className="relative h-[600px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1759143545924-0ea00615a054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5JTIwbGFwdG9wfGVufDF8fHx8MTc3ODI3ODE3Nnww&ixlib=rb-4.1.0&q=80&w=1080)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-3xl px-6">
              <motion.h2
                className="text-4xl md:text-6xl tracking-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                Make Data-Driven Decisions
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                Stop guessing which AI workflow is more efficient. Get precise metrics and make informed choices.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
              >
                <Link to="/dashboard">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black text-lg px-12 py-6">
                    Start Analyzing Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6">
            READY TO OPTIMIZE YOUR AI WORKFLOW?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Compare CLI and MCP usage before your token cost becomes invisible.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black text-lg px-12 py-6">
              Launch Analyzer
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">CLI vs MCP Token Analyzer</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 Token Analyzer. Track smarter, spend less.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
