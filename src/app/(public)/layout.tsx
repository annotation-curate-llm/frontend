import PublicNavbar from '@/components/layout/PublicNavbar'
import Footer from '@/components/layout/Footer'
import Beams from '@/components/ui/Beams'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col relative">

            {/* Content layer - positioned above the background */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <PublicNavbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    )
}