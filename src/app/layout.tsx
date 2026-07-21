import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Modak, Mouse_Memoirs, ZCOOL_KuaiLe } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { RecipeTransitionProvider } from "@/components/recipe-transition-provider";
import "./globals.css";

const modak = Modak({
  variable: "--font-modak",
  weight: "400",
  subsets: ["latin"],
  display: "swap"
});

const mouseMemoirs = Mouse_Memoirs({
  variable: "--font-mouse-memoirs",
  weight: "400",
  subsets: ["latin"],
  display: "swap"
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  variable: "--font-zcool-kuaile",
  weight: "400",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Last Call",
  description: "交互式鸡尾酒探索、酒柜匹配与调制记录。"
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className={`${modak.variable} ${mouseMemoirs.variable} ${zcoolKuaiLe.variable}`}>
        <RecipeTransitionProvider>
          <SiteHeader />
          {children}
        </RecipeTransitionProvider>
      </body>
    </html>
  );
}
