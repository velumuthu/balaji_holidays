'use client';

import { useBookingModal } from "@/context/booking-modal-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { BookingForm } from "./booking-form";

export function BookingModal() {
    const { isOpen, closeModal, defaultDestination } = useBookingModal();

    return (
        <Dialog open={isOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl">Book Your Dream Vacay Today!</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and our travel experts will get in touch with you shortly.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <BookingForm defaultDestination={defaultDestination} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
