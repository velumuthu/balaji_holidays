
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Package } from '@/lib/packages-data';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { PackageDialog } from '@/components/admin/package-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useState } from 'react';

const deletePackage = async (firestore: any, id: string) => {
  if (!firestore) return;
  const docRef = doc(firestore, 'holidayPackages', id);
  deleteDoc(docRef)
    .then(() => {
        toast({
            title: 'Package Deleted',
            description: 'The package has been successfully deleted.',
        });
    })
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
    });
};

export const columns: ColumnDef<Package>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <span className="capitalize">{row.original.category.replace('-', ' ')}</span>
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => <div>{row.original.rating} / 5</div>
  },
  {
    id: 'actions',
    cell: function Actions({ row }) {
      const pkg = row.original;
      const firestore = useFirestore();
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

      return (
        <div className="flex items-center gap-2">
            <PackageDialog 
                isOpen={isEditDialogOpen} 
                setIsOpen={setIsEditDialogOpen} 
                packageData={pkg}
            >
                <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
            </PackageDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the package
                    <span className="font-bold"> &quot;{pkg.name}&quot; </span>
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => deletePackage(firestore, pkg.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
      );
    },
  },
];
