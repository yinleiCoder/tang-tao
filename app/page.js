import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Float3DGallery from "./components/float3DGallery";
import MiniTimelineCards from "./components/miniTimelineCards";

export default function Home() {
  return (
    <main className="font-sans">
      <section className="w-full h-screen grid grid-cols-12 overflow-hidden bg-[#fffef8]">
        <div className="col-start-2 col-end-12 lg:col-start-3 lg:col-end-6 flex flex-col justify-center gap-4">
          <h1 className="text-5xl font-bold">知夏.</h1>
          <div>
            <p className="font-medium">
              你透支了我似水年华的太多，我的爱、我的眼泪，我竟然说我“甘愿”。
            </p>
            <div className="flex gap-2 justify-end">
              <Badge variant="default">尹磊</Badge>
              <Badge variant="default">唐涛</Badge>
            </div>
          </div>
        </div>
        <div className="hidden lg:col-start-7 lg:col-end-12 lg:flex lg:flex-col lg:justify-center lg:items-center">
          <div className="relative w-1/2 aspect-9/16 flex justify-center">
            <span className="absolute inline-block w-full -bottom-6 text-center z-10 text-xs">
              (摄于绵阳市三台县鲁班水库)
            </span>
            <Image
              src="/images/tt59.jpg"
              alt="唐涛摄于三台县鲁班水库"
              fill
              className="object-cover transition-all duration-1000 will-change-transform rounded-md shadow-xl"
            />
          </div>
        </div>
      </section>
      <Float3DGallery />
      <MiniTimelineCards />
      <section className="w-full h-screen overflow-hidden bg-green-300"></section>
    </main>
  );
}
