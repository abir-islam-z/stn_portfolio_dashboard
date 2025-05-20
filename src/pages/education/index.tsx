import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import DashboardSkeleton from "@/components/shared/dashboard-skeleton";
import ErrorComponent from "@/components/shared/error-component";
import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import RepeatableFieldBuilder from "@/components/shared/form-builder/RepeatableFieldBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import TextAreaBuilder from "@/components/shared/form-builder/TextAreaBuilder";
import { Button } from "@/components/ui/button";
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetEducationQuery,
  useUpdateEducationMutation,
} from "@/redux/features/educationApi";
import { IEducationForm, educationSchema } from "./schema";

export default function EducationPage() {
  const {
    data: education,
    isLoading,
    isError,
    refetch,
  } = useGetEducationQuery();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const onSubmit = async (data: IEducationForm) => {
    try {
      await updateEducation(data).unwrap();
      toast.success("Education information updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update education:", error);
      toast.error("Failed to update education information. Please try again.");
    }
  };

  // Prepare form default values
  const getDefaultValues = () => {
    if (!education) return {};

    return {
      degree: education.degree || "",
      institution: education.institution || "",
      location: education.location || "",
      period: education.period || "",
      description: education.description || "",
      cgpa: education.cgpa || "",
      achievements: education.achievements || [
        { icon: "", title: "", description: "" },
      ],
      subjects: education.subjects || [{ name: "", icon: "" }],
      courses: education.courses || [
        { name: "", provider: "", year: "", icon: "" },
      ],
    };
  };

  const iconOptions = [
    { value: "BookOpen", label: "Book" },
    { value: "Code", label: "Code" },
    { value: "Cpu", label: "CPU" },
    { value: "Database", label: "Database" },
    { value: "Globe", label: "Globe" },
    { value: "GraduationCap", label: "Graduation Cap" },
    { value: "Lightbulb", label: "Lightbulb" },
    { value: "Network", label: "Network" },
    { value: "Settings", label: "Settings" },
    { value: "Zap", label: "Zap" },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !education) {
    return (
      <ErrorComponent
        title="Education"
        message="Failed to load education information."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Education
        </h1>
        <p className="text-muted-foreground">
          Manage your education information, achievements, and coursework
        </p>
      </div>

      {/* Edit Form */}
      <CardComponent className="dashboard-card">
        <CardHeader>
          <CardTitle>Education Information</CardTitle>
          <CardDescription>
            Update your education details, achievements, and relevant coursework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={getDefaultValues()}
            onSubmit={onSubmit}
            resolver={zodResolver(educationSchema)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBuilder
                  name="degree"
                  label="Degree"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />

                <InputBuilder
                  name="institution"
                  label="Institution"
                  placeholder="e.g., University of Dhaka"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBuilder
                  name="location"
                  label="Location"
                  placeholder="e.g., Dhaka, Bangladesh"
                />

                <InputBuilder
                  name="period"
                  label="Period"
                  placeholder="e.g., 2015 - 2019"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBuilder
                  name="cgpa"
                  label="CGPA / Grade"
                  placeholder="e.g., 3.8/4.0"
                />
              </div>

              <TextAreaBuilder
                name="description"
                label="Description"
                placeholder="Write about your education experience, specializations, and achievements..."
                rows={3}
              />
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium">Key Achievements</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add your key achievements during your education
              </p>
              <RepeatableFieldBuilder
                name="achievements"
                addButtonLabel="Add Achievement"
                className="space-y-4"
                renderField={(field) => (
                  <div className="grid grid-cols-1 gap-4 p-4 border border-dashed rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectBuilder
                        label="Icon"
                        name={`${field}.icon`}
                        placeholder="Select an icon"
                        options={iconOptions}
                      />
                      <div className="md:col-span-2">
                        <InputBuilder
                          label="Title"
                          name={`${field}.title`}
                          placeholder="e.g., Dean's List, Hackathon Winner..."
                        />
                      </div>
                    </div>
                    <InputBuilder
                      label="Description"
                      name={`${field}.description`}
                      placeholder="Brief description of this achievement"
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium">Key Subjects</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add key subjects you excelled in or specialized in
              </p>
              <RepeatableFieldBuilder
                name="subjects"
                addButtonLabel="Add Subject"
                className="space-y-4"
                renderField={(field) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-dashed rounded-md">
                    <div className="md:col-span-2">
                      <InputBuilder
                        label="Subject Name"
                        name={`${field}.name`}
                        placeholder="e.g., Algorithms & Data Structures"
                      />
                    </div>
                    <SelectBuilder
                      label="Icon"
                      name={`${field}.icon`}
                      placeholder="Select an icon"
                      options={iconOptions}
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-medium">Relevant Courses</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Add relevant courses or certifications you've completed
              </p>
              <RepeatableFieldBuilder
                name="courses"
                addButtonLabel="Add Course"
                className="space-y-4"
                renderField={(field) => (
                  <div className="grid grid-cols-1 gap-4 p-4 border border-dashed rounded-md">
                    <InputBuilder
                      label="Course Name"
                      name={`${field}.name`}
                      placeholder="e.g., Advanced React Patterns"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <InputBuilder
                          label="Provider"
                          name={`${field}.provider`}
                          placeholder="e.g., Frontend Masters, Coursera"
                        />
                      </div>
                      <InputBuilder
                        label="Year"
                        name={`${field}.year`}
                        placeholder="e.g., 2021"
                      />
                    </div>
                    <SelectBuilder
                      label="Icon"
                      name={`${field}.icon`}
                      placeholder="Select an icon"
                      options={iconOptions}
                    />
                  </div>
                )}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Updating..." : "Update Education"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  refetch().then(() => {
                    toast.info(
                      "Education form has been reset to the original values."
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
