import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Upload, Activity } from "lucide-react";
import derma from "@/public/derma.png";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Shield className="h-6 w-6 text-teal-600" />
            <span>DermaScan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-10 md:px-20 lg:px-40">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Advanced Melanoma Detection for Healthcare Professionals
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Our AI-powered skin cancer detection tool helps healthcare
                    professionals provide rapid preliminary assessments for
                    patients. Upload patient images and get instant analysis
                    results.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                      Start Clinical Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative flex items-center justify-end ">
                <Image
                  src={derma}
                  height={500}
                  width={500}
                  alt="Skin cancer detection illustration"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes it easy to get a preliminary assessment of
                  skin concerns.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <Upload className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Upload Patient Image</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Take a clear photo of the patient's skin lesion and upload
                    it to our clinical platform.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <Activity className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI Analysis</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Our advanced AI model analyzes the patient's image for
                    potential signs of melanoma.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <Shield className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Clinical Results</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Receive a preliminary assessment and clinical
                    recommendations for patient care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to enhance your clinical practice?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join healthcare professionals who trust DermaScan for
                  preliminary patient assessments.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Create Professional Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-6 w-6 text-teal-600" />
              <span>DermaScan</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Early detection is key. Our AI-powered tool helps identify
              potential skin issues.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <p className="font-medium">Quick Links</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link href="#" className="hover:underline">
                Features
              </Link>
              <Link href="#" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <p className="font-medium">Legal</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="hover:underline">
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} DermaScan. All rights reserved.
            </p>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              <strong>Disclaimer:</strong> This tool provides preliminary
              clinical assessments only and is not a substitute for professional
              medical diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
