import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import RichTextEditorBuilder from "@/components/shared/form-builder/RichTextEditorBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import TextAreaBuilder from "@/components/shared/form-builder/TextAreaBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAboutMeQuery,
  useUpdateAboutMeMutation,
} from "@/redux/features/aboutMeApi";
import { IAboutMeForm, aboutMeSchema } from "./schema";

export default function AboutPage() {
  const { data: aboutMe, isLoading, isError, refetch } = useGetAboutMeQuery();
  const [updateAboutMe, { isLoading: isUpdating }] = useUpdateAboutMeMutation();

  const onSubmit = async (data: IAboutMeForm) => {
    try {
      await updateAboutMe(data).unwrap();
      toast.success("About me information updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update about me:", error);
      toast.error("Failed to update about me information. Please try again.");
    }
  };

  // Prepare form default values
  const getDefaultValues = () => {
    if (!aboutMe) return {};

    return {
      description: aboutMe.description || "",
      personalInfo: aboutMe.personalInfo || [{ label: "", value: "" }],
      features: aboutMe.features || [{ icon: "", title: "", description: "" }],
    };
  };

  const iconOptions = [
    { value: "Code", label: "Code" },
    { value: "Cpu", label: "CPU" },
    { value: "Globe", label: "Globe" },
    { value: "Rocket", label: "Rocket" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Card className="dashboard-card">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !aboutMe) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          About Me
        </h1>
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <p className="mb-4 text-destructive">
                Error loading about me data. Please try again.
              </p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          About Me
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and expertise
        </p>
      </div>

      {/* Edit Form */}
      <CardComponent className="dashboard-card">
        <CardHeader>
          <CardTitle>About Me Information</CardTitle>
          <CardDescription>
            Update your about me section and personal details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={getDefaultValues()}
            onSubmit={onSubmit}
            resolver={zodResolver(aboutMeSchema)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <RichTextEditorBuilder
                name="description"
                label="About Me Description"
                placeholder="Write a brief introduction about yourself..."
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add key personal information like location, email, etc.
              </p>
              <RepeatableFieldBuilder
                maxItems={4}
                name="personalInfo"
                addButtonLabel="Add Personal Info"
                className="space-y-4"
                renderField={(field) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputBuilder
                      label="Label"
                      type="text"
                      name={`${field}.label`}
                      placeholder="e.g., Location, Email, Phone..."
                    />
                    <InputBuilder
                      type="text"
                      label="Value"
                      name={`${field}.value`}
                      placeholder="e.g., New York, example@email.com..."
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Features & Services</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Highlight your key skills or services
              </p>
              <RepeatableFieldBuilder
                name="features"
                addButtonLabel="Add Feature"
                className="space-y-4"
                renderField={(field) => (
                  <div className="grid grid-cols-1 gap-4 p-4 border border-dashed rounded-md">
                    <SelectBuilder
                      label="Icon"
                      name={`${field}.icon`}
                      placeholder="Select an icon"
                      options={iconOptions}
                    />
                    <InputBuilder
                      label="Title"
                      type="text"
                      name={`${field}.title`}
                      placeholder="e.g., Clean Code, Web Expert..."
                    />
                    <TextAreaBuilder
                      label="Description"
                      name={`${field}.description`}
                      placeholder="Write a brief description of this feature or service..."
                      rows={2}
                    />
                  </div>
                )}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Updating..." : "Update About Me"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  refetch().then(() => {
                    toast.info(
                      "About me form has been reset to the original values."
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
      </CardComponent>
    </div>
  );
}
