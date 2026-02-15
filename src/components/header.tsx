
'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import { Menu, Phone, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useBookingModal } from '@/context/booking-modal-context';
import { useUser } from '@/firebase/auth/use-user';
import { signOut, getAuth } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About Us' },
];

type SiteConfig = {
  notifications: string[];
}

function NotificationBar() {
  const { data: siteConfig } = useDoc<SiteConfig>('siteConfig', 'notifications');
  const notifications = siteConfig?.notifications?.filter(n => n) || [
    "Special discounts on summer packages! Call us now for a custom quote.",
    "Book your dream vacation with packages starting from ₹9,999!",
    "New destinations added: Explore Europe and Southeast Asia.",
  ];

  if (!siteConfig || notifications.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground py-1 text-sm overflow-hidden w-full inline-flex flex-nowrap">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-marquee-partners">
            {notifications.map((note, index) => <li key={index} className="whitespace-nowrap">{note}</li>)}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-marquee-partners" aria-hidden="true">
            {notifications.map((note, index) => <li key={`dup-${index}`} className="whitespace-nowrap">{note}</li>)}
        </ul>
    </div>
  );
}


export function Header() {
  const { openModal } = useBookingModal();
  const { user, loading } = useUser();
  const firebaseApp = useFirebaseApp();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!firebaseApp) return;
    try {
      await signOut(getAuth(firebaseApp));
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NotificationBar />
      
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl">
             <div><span className="text-yellow-500">Balaji</span> Holidays</div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button onClick={() => openModal()}>Book Now</Button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Phone className="h-4 w-4" />
            <div className='flex flex-col'>
                <a href="tel:8695172090" className="hover:text-primary transition-colors">8695172090</a>
                <a href="tel:9787178910" className="hover:text-primary transition-colors">9787178910</a>
            </div>
          </div>
          <ThemeToggle />
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            null
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
            <Button size="sm" onClick={() => openModal()}>Book Now</Button>
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl">
                        <div><span className="text-yellow-500">Balaji</span> Holidays</div>
                    </Link>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                        <Link
                            href={link.href}
                            className="text-lg font-medium transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    </SheetClose>
                    ))}
                </nav>
                <div className='flex flex-col gap-4'>
                    <div className="flex items-center gap-2 text-md font-medium">
                        <Phone className="h-5 w-5" />
                        <div>
                            <a href="tel:8695172090" className="hover:text-primary transition-colors">8695172090</a> / <a href="tel:9787178910" className="hover:text-primary transition-colors">9787178910</a>
                        </div>
                    </div>
                  {loading ? null : user ? (
                    <Button onClick={handleSignOut}>Log Out</Button>
                  ) : (
                    null
                  )}
                </div>
                 <div className='absolute bottom-4 right-4'>
                    <ThemeToggle />
                 </div>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
