import { Button } from "@/components/ui/button";
import { Eye, Lock, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar to-sidebar/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Eye Clinic Manager
          </h1>
          <p className="text-sidebar-foreground/70 mt-2 text-sm">
            Secure patient records management
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to access your patient records
          </p>

          <Button
            data-ocid="login.primary_button"
            className="w-full h-11 text-sm font-semibold"
            onClick={login}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Sign in with Internet Identity
              </span>
            )}
          </Button>

          <div className="mt-8 pt-6 border-t border-border space-y-3">
            <Feature
              icon={<Shield className="w-4 h-4 text-primary" />}
              text="Your data is private — only you can access your patient records"
            />
            <Feature
              icon={<Users className="w-4 h-4 text-primary" />}
              text="Complete patient management with full visit history"
            />
            <Feature
              icon={<Eye className="w-4 h-4 text-primary" />}
              text="Full ophthalmology clinical examination forms"
            />
          </div>
        </div>

        <p className="text-center text-xs text-sidebar-foreground/50 mt-6">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-sidebar-foreground/70"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
