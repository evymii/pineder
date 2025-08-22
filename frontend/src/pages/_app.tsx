import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
// Merged imports - preserving your organized structure while incorporating teammate's improvements
import { ThemeProvider } from "../core/contexts/ThemeContext";
import { TeamsChatProvider } from "../components/features/teams";
import { MentorRedirect } from "../components/features/auth/MentorRedirect";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ThemeProvider>
        <TeamsChatProvider>
          <MentorRedirect />
          <Component {...pageProps} />
        </TeamsChatProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
