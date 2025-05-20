import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import TextAreaBuilder from "@/components/shared/form-builder/TextAreaBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetExperienceByIdQuery,
  useUpdateExperienceMutation,
} from "@/redux/features/experienceApi";
import { experienceSchema, IExperience } from "./schema";

export default function EditExperience() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: experienceData, isLoading: isLoadingExperience } =
    useGetExperienceByIdQuery(id!);

  const [updateExperience, { isLoading: isUpdating }] =
    useUpdateExperienceMutation();

  const onSubmit = async (data: IExperience) => {
    try {
      await updateExperience({ id, ...data }).unwrap();
      toast.success(" experience updated successfully!");
      navigate("/experience");
    } catch (error) {
      console.error("Failed to update :", error);
      toast.error("Failed to update  experience. Please try again.");
    }
  };

  if (isLoadingExperience) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Edit Experience
        </h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <p>Loading experience data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Edit Experience
        </h1>
        <Button variant="outline" onClick={() => navigate("/experience")}>
          Back to Experience
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Experience</CardTitle>
          <CardDescription>Update experience details</CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={
              experienceData
                ? {
                    position: experienceData.position,
                    company: experienceData.company,
                    location: experienceData.location,
                    period: experienceData.period,
                    description: experienceData.description,
                    responsibilities: experienceData.responsibilities || [],
                  }
                : {}
            }
            onSubmit={onSubmit}
            resolver={zodResolver(experienceSchema)}
            className="space-y-6"
          >
            <InputBuilder
              label="Position"
              name="position"
              placeholder="e.g., Senior Software Engineer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBuilder
                label="Company"
                name="company"
                placeholder="e.g., Tech Corp Inc."
              />
              <InputBuilder
                label="Location"
                name="location"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <InputBuilder
              label="Period"
              name="period"
              placeholder="e.g., Jan 2020 - Present"
            />

            <TextAreaBuilder
              label=" Description"
              name="description"
              placeholder="Write a brief description of your role and achievements..."
              rows={3}
            />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Responsibilities</h4>
              <RepeatableFieldBuilder
                name="responsibilities"
                addButtonLabel="Add Responsibility"
                className="space-y-2"
                renderField={(field) => (
                  <InputBuilder
                    name={field}
                    placeholder="e.g., Led a team of 5 developers in building a new product feature"
                  />
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Updating..." : "Update "}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/experience")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </FormBuilder>
        </CardContent>
      </Card>
    </div>
  );
}
