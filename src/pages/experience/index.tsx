import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardSkeleton from "@/components/shared/dashboard-skeleton";
import DeleteDialog from "@/components/shared/dialog/DeleteDialog";
import ErrorComponent from "@/components/shared/error-component";
import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import RichTextEditorBuilder from "@/components/shared/form-builder/RichTextEditorBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useDeleteExperienceMutation,
  useGetCareerSummaryQuery,
  useGetExperienceQuery,
  useUpdateCareerSummaryMutation,
} from "@/redux/features/experienceApi";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  careerSummarySchema,
  ICareerSummary,
  IExperienceUpdate,
} from "./schema";

export default function ExperiencePage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] =
    useState<IExperienceUpdate | null>(null);
  const navigate = useNavigate();
  const {
    data: experiences,
    isLoading,
    isError,
    refetch,
  } = useGetExperienceQuery();
  const { data: careerSummary, isLoading: isUpdating } =
    useGetCareerSummaryQuery();

  const [deleteExperience, { isLoading: isDeleting }] =
    useDeleteExperienceMutation();

  const [updateCareerSummary] = useUpdateCareerSummaryMutation();

  const onSubmit = async (data: ICareerSummary) => {
    try {
      await updateCareerSummary(data).unwrap();
      toast.success("Career Summary updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update Career Summary:", error);
      toast.error("Failed to update Career Summary . Please try again.");
    }
  };

  const handleDeleteClick = (experience: IExperienceUpdate) => {
    setExperienceToDelete(experience);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;

    try {
      await deleteExperience(experienceToDelete?.id!).unwrap();
      toast.success("Experience deleted successfully!");
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to delete experience:", error);
      toast.error("Failed to delete experience. Please try again.");
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !experiences) {
    return (
      <ErrorComponent
        title="Experience"
        message="Failed to load experience information."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neon-text">
            Experience
          </h1>
          <p className="text-muted-foreground">
            Manage your professional experience and work history
          </p>
        </div>
        <Button asChild>
          <Link to="/experience/add">
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Link>
        </Button>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>
            Provide an overview of your professional experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={{
              description: careerSummary?.description || "",
            }}
            onSubmit={onSubmit}
            resolver={zodResolver(careerSummarySchema)}
            className="space-y-6"
          >
            <RichTextEditorBuilder
              name="description"
              label="Experience Summary"
              placeholder="Write a brief overview of your professional experience..."
            />

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Updating..." : "Update Summary"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  refetch().then(() => {
                    toast.info(
                      "Experience form has been reset to the original values."
                    );
                  })
                }
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                Reset Changes
              </Button>
            </div>
          </FormBuilder>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Work History</CardTitle>
          <CardDescription>
            View and manage your professional work history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences && experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <Card key={index} className="relative">
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(`/experience/edit/${experience.id}`)
                      }
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(experience)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {experience.position}
                        </h3>
                        <p className="text-muted-foreground">
                          {experience.company} • {experience.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {experience.period}
                        </p>
                      </div>

                      <p className="text-sm">{experience.description}</p>

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Responsibilities:
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {experience.responsibilities.map(
                            (resp: string, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-muted-foreground"
                              >
                                {resp}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                No work experience found
              </p>
              <Button asChild>
                <Link to="/experience/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Job
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <DeleteDialog
        title="Delete Job Experience"
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        toDelete={experienceToDelete}
        confirmDelete={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
