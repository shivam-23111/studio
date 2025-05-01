import { Header } from "@/components/header";
import { CollaborationArea } from "@/components/collaboration-area";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-4">
        <CollaborationArea />
      </main>
    </div>
  );
}
