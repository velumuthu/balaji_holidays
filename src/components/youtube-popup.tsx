
'use client';

import { useYouTubePopup } from "@/context/youtube-popup-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Youtube } from "lucide-react";

export function YouTubePopup() {
    const { isYouTubePopupOpen, closeYouTubePopup } = useYouTubePopup();

    return (
        <Dialog open={isYouTubePopupOpen} onOpenChange={closeYouTubePopup}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-center">Stay Connected!</DialogTitle>
                    <DialogDescription className="text-center pt-4">
                        Subscribe to our YouTube channel for the latest travel vlogs, tips, and destination guides!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center mt-4">
                    <Button asChild size="lg">
                        <a href="https://www.youtube.com/@balajiholidays-29" target="_blank" rel="noopener noreferrer" onClick={closeYouTubePopup}>
                            <Youtube className="mr-2" />
                            Subscribe on YouTube
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
