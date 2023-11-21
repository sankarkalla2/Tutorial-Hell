"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency-format";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({row}) => {
      const price = row.getValue('price') || 0;

      return formatPrice(price);
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => {
      const isPublished = row.getValue("isPublished") || false;

      return <Badge className={cn("px-4 py-2", isPublished && 'bg-sky-500')}>{isPublished? "Published": "Draft"}</Badge>
    }
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { id } = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-4 w-8 p-0">
  //             Open Menu
  //           </Button>
  //           <MoreHorizontal />
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <Link href={`/teacher/courses/${id}`}>
  //             <DropdownMenuItem>
  //               <Pencil className="h-4 w-4 mr-2" /> Edit
  //             </DropdownMenuItem>
  //           </Link>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
  {
    accessorKey: "id",
    header: "Edit",
    cell: ({row}) => {
      const courseId = row.getValue('id');

      return <Link href={`/teacher/courses/${courseId}`}>
        <Button variant='outline' size='sm'>Edit</Button>
      </Link>
    }
  },
];
