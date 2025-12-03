import Float3DGallery from "./components/float3DGallery";

export default function Home() {
  return (
    <main className="font-sans">
      <section className="relative w-full h-screen overflow-hidden bg-red-300"></section>

      <Float3DGallery />

      <section className="relative w-full h-screen overflow-hidden bg-green-300"></section>
    </main>
  );
}
