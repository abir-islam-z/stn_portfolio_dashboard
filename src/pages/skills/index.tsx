"use client";

import DeleteDialog from "@/components/shared/dialog/DeleteDialog";
import { DataTable } from "@/components/shared/table-builder/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconComponent } from "@/lib/getIconComponent";
import {
  Skill,
  useDeleteSkillTechnologyMutation,
  useGetSkillsTechnologiesQuery,
} from "@/redux/features/skillApi";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const columns: ColumnDef<Skill>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const skill = row.original;
      const IconComponent = getIconComponent(skill.icon);
      return (
        <div className="flex items-center">
          {IconComponent ? (
            <IconComponent className="h-5 w-5 mr-2" icon={skill.icon} />
          ) : (
            <div className="w-5 h-5 bg-muted-foreground/20 rounded mr-2" />
          )}
          <span>{skill.icon}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const skill = row.original;
      return <Badge variant="outline">{skill.category}</Badge>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionComp row={row} />,
  },
];

const ActionComp = ({ row }: { row: Row<Skill> }) => {
  const skill = row.original;
  const [deleteSkill, { isLoading: isDeleting }] =
    useDeleteSkillTechnologyMutation();
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { refetch } = useGetSkillsTechnologiesQuery();

  const handleDeleteClick = (skill: Skill) => {
    setSkillToDelete(skill);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (skillToDelete) {
      try {
        await deleteSkill(skillToDelete.id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete skill:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setSkillToDelete(null);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/skills/edit/${skill.id}`}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteClick(skill)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        title="Skill"
        toDelete={skillToDelete}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default function SkillsPage() {
  const { data: skills, isLoading, isError } = useGetSkillsTechnologiesQuery();
  // const { data: categories } = useGetSkillsCategoriesQuery();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text">
            Skills
          </h1>
          <p className="text-muted-foreground">
            Manage your skills and technologies
          </p>
        </div>
        <Button asChild>
          <Link to="/skills/add">
            <Plus className="mr-2 h-4 w-4" /> Add Skill
          </Link>
        </Button>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>All Skills</CardTitle>
          <CardDescription>
            View and manage your skills and technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <p className="text-destructive">
              Error loading skills. Please try again.
            </p>
          ) : skills && skills.length > 0 ? (
            <DataTable columns={columns} data={skills} />
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No skills found</p>
              <Button asChild>
                <Link to="/skills/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Skill
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
