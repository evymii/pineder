import { Layout } from "../../components/layout/Layout";
import Head from "next/head";

export default function ProfileDemo() {
  return (
    <Layout className="bg-white dark:bg-[#222222]">
      <Head>
        <title>Profile Demo - Pineder</title>
        <meta name="description" content="Demo of the UserProfile component" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            User Profile Component Demo
          </h1>

          <div className="bg-card rounded-lg p-8 border">
            <h2 className="text-xl font-semibold mb-4">How to use:</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Sign in to your account using the Sign In button in the
                navigation
              </li>
              <li>
                Once signed in, you&apos;ll see your profile avatar in the
                top-right corner
              </li>
              <li>Click on the avatar to open the profile modal</li>
              <li>
                The profile shows your name, email, role, topics, rating, and
                more
              </li>
              <li>Click outside or the X button to close the modal</li>
            </ol>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Component Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Responsive design that works on mobile and desktop</li>
                <li>Smooth animations using Framer Motion</li>
                <li>Dark mode support</li>
                <li>Accessible dialog implementation</li>
                <li>Customizable user data through props</li>
                <li>Role-based display (Student/Teacher)</li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                How to Test:
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Sign in to your account to see the profile avatar in the
                  navigation
                </p>
                <p>• Click on the avatar to open the profile modal</p>
                <p>
                  • The profile shows your name, email, role, and other details
                </p>
                <p>• Click outside or the X button to close the modal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
