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
import {
  IProject,
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/redux/features/projectApi";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const columns: ColumnDef<IProject>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div
          className="max-w-[300px] truncate"
          dangerouslySetInnerHTML={{
            __html: project.description,
          }}
        />
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline">+{project.tags.length - 3}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Badge
          variant={project.isFeatured ? "default" : "outline"}
          className="text-center"
        >
          {project.isFeatured ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionComp row={row} />,
  },
];

const ActionComp = ({ row }: { row: Row<IProject> }) => {
  const project = row.original;
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<IProject | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { refetch } = useGetProjectsQuery();

  const handleDeleteClick = (project: IProject) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await deleteProject(projectToDelete.id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete project:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setProjectToDelete(null);
      }
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/projects/edit/${project.id}`}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteClick(project)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        title="Project"
        toDelete={projectToDelete}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default function ProjectsPage() {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Button asChild>
          <Link to="/projects/add">
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            View and manage your portfolio projects
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
              Error loading projects. Please try again.
            </p>
          ) : projects && projects.length > 0 ? (
            <DataTable columns={columns} data={projects} />
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <Button asChild>
                <Link to="/projects/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Project
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
