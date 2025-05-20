import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ButtonBuilder from "@/components/shared/form-builder/ButtonBuilder";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import InputBuilder from "@/components/shared/form-builder/InputBuilder";
import SelectBuilder from "@/components/shared/form-builder/SelecBuilder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetEducationQuery,
  useUpdateEducationMutation,
} from "@/redux/features/educationApi";
import { z } from "zod";

// Define a schema just for the course form
const addCourseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  provider: z.string().min(1, "Provider is required"),
  year: z.string().min(1, "Year is required"),
  icon: z.string().min(1, "Icon is required"),
});

type AddCourseForm = z.infer<typeof addCourseSchema>;

export default function AddCourse() {
  const navigate = useNavigate();
  const { data: education, isLoading } = useGetEducationQuery();
  const [updateEducation, { isLoading: isUpdating }] =
    useUpdateEducationMutation();

  const iconOptions = [
    { value: "Code", label: "Code" },
    { value: "Cpu", label: "CPU" },
    { value: "BookOpen", label: "Book" },
    { value: "Palette", label: "Design" },
    { value: "FileText", label: "Document" },
    { value: "Zap", label: "Skill" },
    { value: "Globe", label: "Web" },
    { value: "Database", label: "Database" },
  ];

  const onSubmit = async (data: AddCourseForm) => {
    if (!education) return;

    try {
      // Add the new course to the existing ones
      const updatedEducation = {
        ...education,
        courses: [...(education.courses || []), data],
      };

      await updateEducation(updatedEducation).unwrap();
      toast.success("Course added successfully!");
      navigate("/education");
    } catch (error) {
      console.error("Failed to add course:", error);
      toast.error("Failed to add course. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight neon-text">
          Add Course
        </h1>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <p>Loading education data...</p>
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
          Add Course
        </h1>
        <Button variant="outline" onClick={() => navigate("/education")}>
          Back to Education
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Course</CardTitle>
          <CardDescription>
            Add a new course or certification to your education profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder
            defaultValues={{
              name: "",
              provider: "",
              year: "",
              icon: "",
            }}
            onSubmit={onSubmit}
            resolver={zodResolver(addCourseSchema)}
            className="space-y-6"
          >
            <InputBuilder
              label="Course Name"
              name="name"
              placeholder="e.g., Advanced React Patterns"
              description="Enter the name of the course or certification"
            />

            <InputBuilder
              label="Provider"
              name="provider"
              placeholder="e.g., Frontend Masters, Coursera, Udemy"
              description="Enter the course provider or platform"
            />

            <InputBuilder
              label="Year"
              name="year"
              placeholder="e.g., 2023"
              description="Enter the year you completed this course"
            />

            <SelectBuilder
              label="Icon"
              name="icon"
              placeholder="Select an icon"
              options={iconOptions}
              description="Choose an icon that represents this course"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <ButtonBuilder className="w-full sm:w-auto">
                {isUpdating ? "Adding..." : "Add Course"}
              </ButtonBuilder>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/education")}
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
