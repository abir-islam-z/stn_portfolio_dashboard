import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import FileInputBuilder from "@/components/shared/form-builder/FileInputBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import RichTextEditorBuilder from "@/components/shared/form-builder/RichTextEditorBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import SwitchBuilder from "@/components/shared/form-builder/SwitchBuilder";
import TagInputBuilder from "@/components/shared/form-builder/TagInputBuilder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
} from "@/redux/features/projectApi";
import { toast } from "sonner";
import { IProjectEdit, projectEditSchema } from "./schema";

export default function EditProject() {
  const { id } = useParams<{ id: string }>();

  console.log("EditProject id", id);
  const projectId = id;
  const navigate = useNavigate();
  const [updateProject] = useUpdateProjectMutation();

  // Get the project data
  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectQuery(projectId!, {
    skip: !projectId,
  });

  // Prepare form values for the project
  const [formValues, setFormValues] = useState<Partial<IProjectEdit> | null>(
    null
  );

  // Set form values when project data is loaded
  useEffect(() => {
    if (project) {
      // Transform features back to the format expected by the RepeatableFieldBuilder
      const featuresArray = project.features.map((feature: string) => ({
        feature,
      }));

      setFormValues({
        ...project,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: featuresArray as any, // Cast to any to avoid type issues
        image: [], // Empty array as we don't have the File objects anymore
      });
    }
  }, [project]);

  const onSubmit = async (data: IProjectEdit) => {
    try {
      // If no new images were selected, keep the existing ones
      const updateData = {
        ...data,
        id: projectId,
        // Only include the new image if one was provided
        image: data.image && data.image.length > 0 ? data.image : undefined,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateProject(updateData as any).unwrap();
      toast.success("Project updated successfully!");
      navigate("/projects");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6 lg:p-8 border rounded-lg shadow-md">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-4 md:p-6 lg:p-8 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-destructive">Error</h2>
        <p>Failed to load project. Please try again later.</p>
      </div>
    );
  }

  if (!formValues) return null;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Edit Project: {project.title}</h1>
      <p className="text-muted-foreground">
        Update the details of your project below.
      </p>

      <FormBuilder
        defaultValues={formValues}
        onSubmit={onSubmit}
        resolver={zodResolver(projectEditSchema)}
        className="space-y-4"
      >
        <InputBuilder
          name="title"
          label="Project Title"
          placeholder="Enter project title"
          type="text"
        />

        <div className="space-y-2">
          <RichTextEditorBuilder
            name="description"
            label="Project Description"
            placeholder="Write a detailed description of your project..."
          />
          <p className="text-xs text-muted-foreground">
            Use the toolbar above to format your text, add links, lists, and
            more. You can also add images by URL.
          </p>
        </div>

        <div>
          <FileInputBuilder
            name="image"
            label="Project Image"
            maxFileCount={2}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only upload new images if you want to replace the existing ones.
            Leave empty to keep the current images.
          </p>
        </div>

        <SelectBuilder
          name="category"
          label="Project Category"
          className="mt-2"
          options={[
            { value: "web", label: "Web" },
            { value: "mobile", label: "Mobile" },
            { value: "desktop", label: "Desktop" },
          ]}
        />

        <TagInputBuilder
          name="tags"
          label="Project Technologies"
          placeholder="Type technologies like 'React, TypeScript, Redux' and press Enter"
          showHelper={true}
        />

        <InputBuilder
          name="demoUrl"
          label="Demo URL"
          placeholder="Enter demo URL"
          type="url"
        />

        <InputBuilder
          name="repoUrl"
          label="Repository URL"
          placeholder="Enter repository URL"
          type="url"
        />

        <RepeatableFieldBuilder
          name="features"
          label="Project Features"
          defaultItem={{
            feature: "",
          }}
          maxItems={5}
          renderField={(name, index) => (
            <InputBuilder
              name={`${name}.feature`}
              label={`Feature ${index + 1}`}
              placeholder="Enter feature"
              type="text"
            />
          )}
        />

        <SwitchBuilder
          name="isFeatured"
          description="If this project is featured, it will be highlighted on the homepage."
          label="Is this project featured?"
          className="mt-2"
        />

        <div className="flex gap-4 items-center">
          <ButtonBuilder>Update Project</ButtonBuilder>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => navigate("/projects")}
          >
            Cancel
          </Button>
        </div>
      </FormBuilder>
    </div>
  );
}
