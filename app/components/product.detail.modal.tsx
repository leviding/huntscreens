'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { ProductDetailData } from "../types/api.types";
import DetailSkeleton from "../skeletons/detail.skeleton";
import { useEffect, useState } from "react";
import { Producthunt } from "@/db/schema/ph";
import GoBack from "./back.button";
import Spiner from "../skeletons/loading.spin";

export default function ProductDetailModal(props: {
  productId: string,
}) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())

  const [currentPid, setCurrentPid] = useState(props.productId);
  const [product, setCurrentProduct] = useState<Producthunt | null>(null);
  const { data, isLoading } = useSWR<ProductDetailData>(`/api/product/${currentPid}`, fetcher);

  useEffect(() => {
    if (product) window.history.replaceState(null, '', `/p/${product.id}`);
    if (product && product.id.toString() !== currentPid) {
      setCurrentPid(product.id.toString());
    }
  }, [product]);

  useEffect(() => {
    if (data && data.product && data.product.id !== product?.id) {
      setCurrentProduct(data.product);
    }
  }, [data]);



  if (!product) return <DetailSkeleton />

  const next = data?.next || null;
  const prev = data?.prev || null;

  const prevProduct = () => {
    if (!prev) return;
    setCurrentPid(prev.id.toString());
    setCurrentProduct(prev);
  };

  const nextProduct = () => {
    if (!next) return;
    setCurrentPid(next.id.toString());
    setCurrentProduct(next);
  }

  return <>
    <div className="flex flex-row w-full">
      <div className="w-full h-screen flex flex-col p-0 md:p-10">
        <div className="w-full h-11 rounded-t-lg bg-gray-200 dark:bg-gray-700  flex items-center px-3 justify-between">
          <div className="space-x-1.5  flex flex-row gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <div className="flex flex-row gap-2">
            {isLoading &&
              <Spiner className="mr-5" />
            }
            {prev &&
              <Button onClick={prevProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronLeft strokeWidth={1.5} color="gray" className=" w-6 h-6" />
              </Button>
            }
            {next &&
              <Button onClick={nextProduct} size={"icon"} variant={"ghost"} className=" rounded-full">
                <ChevronRight strokeWidth={1.5} color="gray" className=" w-6 h-6" />
              </Button>
            }
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 border-t-0 w-full h-screen overflow-auto  border-gray-200 dark:border-gray-600 border">
          <img loading="lazy" src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${product?.uuid}.webp`}></img>
        </div>
      </div>
      <div className="md:w-[500px] hidden md:flex flex-col pb-10 my-10 border rounded-lg border-r-0 rounded-r-none shadow-sm">

        <div className="absolute top-15 right-5">
          <GoBack className=" border-t-0 rounded-t-none hover:border-t" />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="flex flex-row gap-4 items-center  p-5 mt-10">
            <img loading="lazy" src={product?.thumbnail?.url} className=" w-20 rounded-lg" />
            <div className="flex flex-col gap-1 ">
              <h1 className=" text-xl font-semibold">{product?.name}</h1>
              <h2 className="  text-slate-600">
                {product?.tagline}
              </h2>
            </div>
          </div>
        </div>
        <div>
        </div>


        <div className="px-5">
          <h2 className="text-slate-500">
            {product?.description}
          </h2>
        </div>

        <div className="p-5 gap-2 flex flex-wrap">
          {product && product.topics?.nodes.map((item) =>
            <Badge key={item.name} className="py-1 text-slate-500" variant="outline">{item.name}</Badge>
          )}
        </div>

        <div className="p-5 flex flex-row gap-5">
          <Link className="w-full h-full" href={product?.website || ""} target="__blank">
            <Button className="w-full h-full" variant={"outline"}>
              GET IT
            </Button>
          </Link>
          <Link className="w-full h-full" href={product?.url || ""} target="__blank">
            <Button className="w-full border" variant={"outline"}>VOTE ({product?.votesCount || ""})</Button>
          </Link>
        </div>


        <div className="flex h-full items-end px-5">
          <div className="w-full flex flex-row justify-start gap-4">
            {prev &&
              <Button onClick={prevProduct} variant={"outline"} size={"icon"} className="rounded-full" >
                <ChevronLeft strokeWidth={1.5} color="gray" className=" w-6 h-6" />
              </Button>
            }

            {next &&
              <Button onClick={nextProduct} variant={"outline"} size={"icon"} className="rounded-full" >
                <ChevronRight strokeWidth={1.5} color="gray" className=" w-6 h-6" />
              </Button>
            }

          </div>
        </div>
      </div>
    </div>
  </>
}