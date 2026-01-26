
'use client';

import { useState, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PackageForm } from './package-form';
import { Package } from '@/lib/packages-data';


// This interface is for when PackageDialog is used to wrap a trigger (e.g. Add button)
interface PackageDialogWrapperProps {
  children: ReactNode;
  packageData?: Package;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}


export function PackageDialog({ children, packageData, isOpen, setIsOpen }: PackageDialogWrapperProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>{packageData ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
                {packageData ? 'Update the details for this package.' : 'Fill in the form to add a new holiday package.'}
            </DialogDescription>
            </DialogHeader>
            <PackageForm packageData={packageData} setDialogOpen={setIsOpen} />
        </DialogContent>
    </Dialog>
  );
}
